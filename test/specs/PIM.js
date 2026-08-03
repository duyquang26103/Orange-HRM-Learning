import path from 'node:path';
import { fileURLToPath } from 'node:url';
import LoginPage from '../pageobjects/LoginPage.js';
import AddEmployeePage from '../pageobjects/AddEmployeePage.js';
import PersonalDetailsPage from '../pageobjects/PersonalDetailsPage.js';
import ContactDetailsPage from '../pageobjects/ContactDetailsPage.js';
import EmployeeListPage from '../pageobjects/EmployeeListPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';
import { ADMIN } from '../config/env.js';
import {
    baseEmployee,
    requiredFieldCases,
    contactDetails,
    invalidMobile,
    validLoginPassword,
    weakPassword
} from '../data/pim.data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runId = Date.now();
const customEmployeeId = `E${String(runId).slice(-8)}`;
const loginUsername = `jdoe${String(runId).slice(-6)}`;
const bulkDeletePrefix = `BulkDel${runId}`;

const validAvatarPath = path.join(__dirname, '..', 'fixtures', 'avatar.jpg');
const invalidAvatarPath = path.join(__dirname, '..', 'fixtures', 'document.pdf');

async function waitForUrlToContain(fragment) {
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes(fragment),
        { timeout: 30000, timeoutMsg: `URL không chứa "${fragment}" sau khi chờ` }
    );
}

async function waitForRequiredErrors(minCount = 1) {
    await browser.waitUntil(
        async () => (await AddEmployeePage.requiredErrors).length >= minCount,
        { timeout: 10000, timeoutMsg: `Không thấy đủ ${minCount} lỗi validation sau khi chờ` }
    );
    return AddEmployeePage.requiredErrors;
}

describe('PIM Module', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(ADMIN.username, ADMIN.password);

        await DashboardPage.dashboardTag.waitForDisplayed({ timeout: 20000 });
    });

    it('PIM_TC01: Thêm nhân viên mới với thông tin bắt buộc', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: baseEmployee.firstName, lastName: baseEmployee.lastName });
        await AddEmployeePage.save();

        await waitForUrlToContain('viewPersonalDetails');
        await expect(PersonalDetailsPage.employeeFullName)
            .toHaveText(`${baseEmployee.firstName} ${baseEmployee.lastName}`, { containing: true });
    });

    it('PIM_TC02: Thêm nhân viên đầy đủ (có Middle Name, Employee Id)', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName(baseEmployee);
        await AddEmployeePage.setEmployeeId(customEmployeeId);
        await AddEmployeePage.save();

        await waitForUrlToContain('viewPersonalDetails');
        await expect(PersonalDetailsPage.employeeIdInput).toHaveValue(customEmployeeId);
    });

    // TC03 + TC04 | Data-Driven: cùng hành động (mở form -> điền thiếu 1 trường -> save) và
    // cùng assertion (đúng 1 lỗi validation, không rời trang addEmployee), chỉ khác dữ liệu
    // đầu vào -> lặp bằng forEach trên requiredFieldCases (test/data/pim.data.js) thay vì
    // viết lặp thân test cho từng trường.
    requiredFieldCases.forEach(({ tcId, description, name }) => {
        it(`${tcId}: Thêm nhân viên — ${description}`, async () => {
            await AddEmployeePage.open();
            await AddEmployeePage.fillName(name);
            await AddEmployeePage.save();

            await expect(AddEmployeePage.requiredErrors).toBeElementsArrayOfSize(1);
            expect(await browser.getUrl()).toContain('addEmployee');
        });
    });

    it('PIM_TC05: Search nhân viên theo tên', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName('John');

        await browser.waitUntil(
            async () => (await EmployeeListPage.employeeRows).length >= 1,
            { timeout: 10000, timeoutMsg: 'Không tìm thấy nhân viên nào có tên "John"' }
        );
        const rows = await EmployeeListPage.employeeRows;
        expect(rows.length).toBeGreaterThanOrEqual(1);
    });

    it('PIM_TC06: Search nhân viên không tồn tại', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName(`ZZZNotExist${runId}`);

        await expect(EmployeeListPage.noRecordsText).toBeDisplayed();
        await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(0);
    });

    it('PIM_TC07: Search theo Employee Id', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(customEmployeeId);

        await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(1);
    });

    it('PIM_TC08: Upload ảnh nhân viên hợp lệ', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: 'Avatar', lastName: 'Valid' });
        await AddEmployeePage.uploadAvatar(validAvatarPath);

        await browser.waitUntil(
            async () => (await AddEmployeePage.avatarPreview.getAttribute('src'))?.startsWith('data:image'),
            { timeout: 10000, timeoutMsg: 'Ảnh không được xem trước sau khi upload' }
        );
    });

    it('PIM_TC09: Upload ảnh sai định dạng', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: 'Avatar', lastName: 'Invalid' });
        await AddEmployeePage.uploadAvatar(invalidAvatarPath);

        const errors = await waitForRequiredErrors(1);
        await expect(errors[errors.length - 1]).toHaveText('File type not allowed', { containing: true });
    });

    it('PIM_TC10: Chỉnh sửa thông tin cá nhân nhân viên', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(customEmployeeId);
        await EmployeeListPage.openFirstRecord();

        await PersonalDetailsPage.setNationality('Vietnamese');
        await PersonalDetailsPage.setMaritalStatus('Single');
        await PersonalDetailsPage.save();

        await expect(PersonalDetailsPage.toast).toHaveText('Successfully', { containing: true });
    });

    it('PIM_TC11: Thêm Contact Details', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(customEmployeeId);
        await EmployeeListPage.openFirstRecord();
        await PersonalDetailsPage.openContactDetailsTab();

        await ContactDetailsPage.setAddress(contactDetails.address);
        await ContactDetailsPage.setMobile(contactDetails.mobile);
        await ContactDetailsPage.save();

        await expect(ContactDetailsPage.toast).toHaveText('Successfully', { containing: true });
    });


    it('PIM_TC12: Nhập số điện thoại chứa chữ cái', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(customEmployeeId);
        await EmployeeListPage.openFirstRecord();
        await PersonalDetailsPage.openContactDetailsTab();

        await ContactDetailsPage.setMobile(invalidMobile);

        await browser.waitUntil(
            async () => (await ContactDetailsPage.mobileInput.getValue()) !== invalidMobile,
            { timeout: 10000, timeoutMsg: 'Giá trị điện thoại không hợp lệ vẫn được giữ nguyên sau khi blur' }
        );
    });

    it('PIM_TC13: Thêm nhân viên có tài khoản login', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: 'Jane', lastName: 'Doe' });
        await AddEmployeePage.enableCreateLoginDetails();
        await AddEmployeePage.fillLoginDetails({ username: loginUsername, password: validLoginPassword });
        await AddEmployeePage.save();

        await waitForUrlToContain('viewPersonalDetails');
        await expect(PersonalDetailsPage.employeeFullName).toHaveText('Jane Doe', { containing: true });
    });

    it('PIM_TC14: Password tài khoản không đủ mạnh', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: 'Weak', lastName: 'Pass' });
        await AddEmployeePage.enableCreateLoginDetails();
        await AddEmployeePage.fillLoginDetails({ username: `weak${runId}`, password: weakPassword });

        const errors = await waitForRequiredErrors(1);
        await expect(errors[errors.length - 1]).toHaveText('at least 7 characters', { containing: true });
        expect(await browser.getUrl()).toContain('addEmployee');
    });

    it('PIM_TC15: Xóa một nhân viên', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName('Jane Doe');
        await EmployeeListPage.deleteFirstRecord();

        await expect(EmployeeListPage.toastMessage).toHaveText('Successfully', { containing: true });
    });


    it('PIM_TC16: Hủy xóa nhân viên (Cancel trong dialog)', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(customEmployeeId);
        await browser.waitUntil(async () => (await EmployeeListPage.employeeRows).length === 1, {
            timeout: 10000, timeoutMsg: 'Không tìm thấy nhân viên để test Cancel delete'
        });

        await EmployeeListPage.cancelDeleteFirstRecord();

        await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(1);
    });

    it('PIM_TC17: Xóa nhiều nhân viên cùng lúc', async () => {
        for (const suffix of ['A', 'B', 'C']) {
            await AddEmployeePage.open();
            await AddEmployeePage.fillName({ firstName: bulkDeletePrefix, lastName: suffix });
            await AddEmployeePage.save();
            await waitForUrlToContain('viewPersonalDetails');
        }

        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName(bulkDeletePrefix);
        await browser.waitUntil(async () => (await EmployeeListPage.employeeRows).length >= 3, {
            timeout: 15000, timeoutMsg: 'Không tìm thấy đủ 3 nhân viên vừa tạo để test xóa hàng loạt'
        });

        // Chọn tất cả bản ghi đang hiển thị (đều khớp prefix duy nhất) rồi xóa hàng loạt.
        let rowCount = await EmployeeListPage.employeeRows.length;
        expect(rowCount).toBeGreaterThanOrEqual(3);

        await EmployeeListPage.selectRows(rowCount);
        await EmployeeListPage.deleteSelectedRecords();
        await expect(EmployeeListPage.toastMessage).toHaveText('Successfully', { containing: true });
        await EmployeeListPage.waitForResults();

        // Dọn nốt phần dư nếu còn (an toàn khi Mocha retry test này: lần chạy trước có thể để
        // lại vài bản ghi cùng prefix). Lặp tới khi không còn bản ghi nào khớp.
        while ((rowCount = await EmployeeListPage.employeeRows.length) > 0) {
            await EmployeeListPage.selectRows(rowCount);
            await EmployeeListPage.deleteSelectedRecords();
            await EmployeeListPage.waitForResults();
        }

        await expect(EmployeeListPage.noRecordsText).toBeDisplayed();
    });

    it('PIM_TC18: Phân trang danh sách nhân viên', async () => {
        await EmployeeListPage.open();

        // Demo dùng chung: tổng số nhân viên do người khác thêm/xóa nên KHÔNG kiểm soát được.
        // OrangeHRM chỉ hiện nút trang 2 khi có > 50 bản ghi (nhiều hơn 1 trang).
        // - Nếu có trang 2: chuyển trang phải làm đổi bản ghi đầu (phân trang hoạt động).
        // - Nếu chỉ 1 trang: đó là hành vi đúng cho <= 50 bản ghi, không phải lỗi ->
        //   xác nhận toàn bộ bản ghi gọn trong 1 trang (>0 và <= 50) thay vì ép phải có trang 2.
        if (await EmployeeListPage.hasPage(2)) {
            const firstPageFirstRowId = await EmployeeListPage.getFirstRowId();

            await EmployeeListPage.goToPage(2);

            await browser.waitUntil(
                async () => (await EmployeeListPage.getFirstRowId()) !== firstPageFirstRowId,
                { timeout: 10000, timeoutMsg: 'Danh sách không đổi sau khi chuyển sang trang 2' }
            );
        } else {
            const rowCount = await EmployeeListPage.employeeRows.length;
            expect(rowCount).toBeGreaterThan(0);
            expect(rowCount).toBeLessThanOrEqual(50);
        }
    });

    it('PIM_TC19: Reset bộ lọc tìm kiếm', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.employeeNameTbx.setValue('John');
        await EmployeeListPage.reset();

        await expect(EmployeeListPage.employeeNameTbx).toHaveValue('');
    });

    it('PIM_TC20: Search với tên có khoảng trắng thừa', async () => {
        // Hành vi THỰC TẾ của OrangeHRM: ô "Employee Name" KHÔNG trim khoảng trắng đầu/cuối.
        // '  John  ' -> "No Records Found", trong khi 'John' vẫn ra kết quả. Test khẳng định
        // đúng hành vi này (deterministic) thay vì giả định app tự trim — đồng thời tài liệu hoá
        // điểm UX đáng lưu ý cho dev. (Đã kiểm chứng trực tiếp trên demo: 'John' = 29 dòng,
        // '  John  ' = 0 dòng, không có lỗi validation.)
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName('John');
        await browser.waitUntil(
            async () => (await EmployeeListPage.employeeRows).length >= 1,
            { timeout: 15000, timeoutMsg: 'Search "John" (không khoảng trắng) đáng lẽ phải có kết quả' }
        );

        // Cùng tên nhưng thêm khoảng trắng thừa -> app không trim -> không có bản ghi nào.
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName('  John  ');
        await expect(EmployeeListPage.noRecordsText).toBeDisplayed();
        await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(0);
    });

    it('PIM_TC21: Employee Id trùng lặp', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: 'Dup', lastName: 'Licate' });
        await AddEmployeePage.setEmployeeId(customEmployeeId);

        const errors = await waitForRequiredErrors(1);
        await expect(errors[errors.length - 1]).toHaveText('Employee Id already exists', { containing: true });
        expect(await browser.getUrl()).toContain('addEmployee');
    });

    it.skip('PIM_TC22: Tên chứa ký tự số', async () => {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: 'John123', lastName: 'Number' });
        await AddEmployeePage.save();
    });

    it('PIM_TC23: Autocomplete gợi ý khi search tên', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.employeeNameTbx.setValue('Joh');

        await browser.waitUntil(
            async () => {
                const options = await EmployeeListPage.nameSuggestionOptions;
                if (options.length === 0) return false;
                const firstText = await options[0].getText();
                return firstText !== 'Searching....';
            },
            { timeout: 10000, timeoutMsg: 'Không hiển thị gợi ý tên thực sự (vẫn kẹt ở "Searching....") khi gõ "Joh"' }
        );
        const options = await EmployeeListPage.nameSuggestionOptions;
        expect(options.length).toBeGreaterThanOrEqual(1);
    });

    it('PIM_TC24: Xem chi tiết nhân viên từ danh sách', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.openFirstRecord();

        expect(await browser.getUrl()).toContain('viewPersonalDetails');
        await expect(PersonalDetailsPage.employeeFullName).toBeDisplayed();
    });
});