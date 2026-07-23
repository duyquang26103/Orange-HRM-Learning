// test/specs/AdminList.js
import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/LoginPage.js';
import AdminPage from '../pageobjects/AdminPage.js';
import AddUserPage from '../pageobjects/AddUserPage.js';
import SideMenuComponent from '../pageobjects/components/SideMenuComponent.js';
import AddEmployeePage from '../pageobjects/AddEmployeePage.js';
import employeeFlow from '../flows/employeeFlow.js';

describe('Admin Management — Split Test Cases', () => {

    let testUsername;
    const employeeName = 'Nguyen Van An';

    before(async () => {
        await browser.maximizeWindow();
        const randomStr = Math.random().toString(36).substring(2, 7);
        testUsername = `TestUser_${randomStr}`;

        await LoginPage.open();
        await LoginPage.login('Admin', 'admin123');

        await SideMenuComponent.goTo('Admin');
    });

    it.only('Tạo data test nhân viên mới thành công bằng Flow Pattern', async () => {
        const empId = `EMP_${Math.floor(Math.random() * 1000)}`;

        await employeeFlow.createNewEmployee('Nguyen', 'Van', 'An', empId);
        await expect(AddEmployeePage.employeeProfileHeader).toHaveText('Nguyen An');
        await expect(AddEmployeePage.employeeIdTbx).toHaveValue(empId);
    });


    it('TC_01: Tạo thành công User mới với quyền Admin', async () => {
        await SideMenuComponent.goTo('Admin');
        // 1. Khởi tạo một Username ngẫu nhiên riêng cho tài khoản Admin mới này
        const randomId = Math.floor(Math.random() * 10000);
        const adminUsername = `NewAdmin_${randomId}`;

        await AdminPage.clickAddUser();
        await AddUserPage.createUser('Admin', employeeName, 'Enabled', adminUsername, 'Password123!'
        );

        await expect(browser).toHaveUrl(expect.stringContaining('admin/viewSystemUsers'));


        await AdminPage.searchAndFilterUser(adminUsername, 'Admin');


        await expect(AdminPage.tblRows).toBeElementsArrayOfSize(1);
        await expect(AdminPage.firstRowCellUsername).toHaveText(adminUsername);

        // 7. Làm sạch dữ liệu (Xóa tài khoản admin vừa tạo này đi để tránh rác hệ thống)
        await AdminPage.deleteUserInList();
    });

    it.only('TC_02: Tạo thành công User mới với quyền ESS', async () => {
        await SideMenuComponent.goTo('Admin');
        await AdminPage.clickAddUser();
        await AddUserPage.createUser('ESS', employeeName, 'Enabled', testUsername, 'Password123!');

        await browser.waitUntil(
            async () => {
                const currentUrl = await browser.getUrl();
                return currentUrl.includes('admin/viewSystemUsers');
            },
            {
                timeout: 7000,
                timeoutMsg: 'Lưu thất bại hoặc hệ thống không tự động chuyển hướng về Admin List'
            }
        );

        await expect(browser).toHaveUrl(expect.stringContaining('admin/viewSystemUsers'));
    });

    it('TC_03: Tìm kiếm User theo chính xác Username', async () => {

        await AdminPage.userNameTbx.waitForEnabled({ timeout: 5000 });
        await AdminPage.userNameTbx.setValue(testUsername);
        await AdminPage.searchBtn.click();
        await AdminPage.tblRows[0].waitForDisplayed({ timeout: 5000 });

        // Kiểm tra xem dòng đầu tiên có đúng tên user vừa tạo không
        await expect(AdminPage.firstRowCellUsername).toHaveText(testUsername);
    });

    it('TC_04: Lọc danh sách (Filter) theo User Role', async () => {
        await SideMenuComponent.goTo('Admin');

        await AdminPage.userNameTbx.setValue('');

        // Chọn filter theo role ESS
        await AdminPage.userRoleDdl.click();
        await AdminPage.dropdownOption('ESS').click();
        await AdminPage.searchBtn.click();
        await AdminPage.tblRows[0].waitForDisplayed({ timeout: 5000 });

        // Verify danh sách trả về hiển thị (ít nhất là lớn hơn hoặc bằng 1)
        const rowCount = await AdminPage.tblRows.length;
        await expect(rowCount).toBeGreaterThanOrEqual(1);
    });

    it('TC_05: Xác thực (Verify) User vừa tạo hiển thị duy nhất 1 kết quả', async () => {
        // Kết hợp cả search tên và lọc đúng role để verify độ chính xác
        await AdminPage.searchAndFilterUser(testUsername, 'ESS');

        await expect(AdminPage.tblRows).toBeElementsArrayOfSize(1);
        await expect(AdminPage.firstRowCellUsername).toHaveText(testUsername);
    });

    it('TC_06: Xóa (Delete) User vừa tạo và verify sạch dữ liệu', async () => {
        await AdminPage.deleteUserInList();

        // Tìm kiếm lại để chắc chắn user không còn tồn tại
        await AdminPage.searchAndFilterUser(testUsername, 'ESS');
        await expect(AdminPage.tblRows).toBeElementsArrayOfSize(0);
    });

    it('TC_07: Tạo user thất bại — Bỏ trống ô Username', async () => {
        await AdminPage.clickAddUser();
        await AddUserPage.createUser('ESS', employeeName, 'Enabled', '', 'Password123!');

        await AddUserPage.requiredUsernameMsg.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: 'Màn hình không hiển thị lỗi Required dưới ô Username sau 5 giây!'
        });



        await expect(AddUserPage.requiredUsernameMsg).toBeDisplayed();
        await expect(AddUserPage.requiredUsernameMsg).toHaveText('Required');
        await expect(browser).toHaveUrl(expect.stringContaining('admin/saveSystemUser'));
    });

    it('TC_08: Tạo user thất bại — Username đã tồn tại (Trùng lặp)', async () => {
        await AdminPage.clickAddUser();
        await AddUserPage.createUser('Admin', employeeName, 'Enabled', 'Admin', 'Password123!');
        await AddUserPage.duplicateUsernameMsg.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: 'Màn hình không hiển thị lỗi Duplicate dưới ô Username sau 5 giây!'
        });

        await expect(AddUserPage.duplicateUsernameMsg).toBeDisplayed();
        await expect(AddUserPage.duplicateUsernameMsg).toHaveText('Already exists');
        await expect(browser).toHaveUrl(expect.stringContaining('admin/saveSystemUser'));
    });
});