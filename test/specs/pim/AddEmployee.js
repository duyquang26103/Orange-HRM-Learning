import LoginPage from '../../pageobjects/login-page/LoginPage.js';
import AddEmployeePage from '../../pageobjects/pim-page/AddEmployeePage.js';
import { addEmployeeData } from '../../data/addEmployee.js';
import { credentials } from '../../data/credentials.js';

describe('PIM - Add Employee', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(credentials.admin.username, credentials.admin.password);
    });

    // ADDEMP_TC01 | Severity: S | Priority: Critical | Happy path
    it('ADDEMP_TC01: thêm nhân viên mới thành công với thông tin hợp lệ', async () => {
        const testData = addEmployeeData.validEmployee;
        const uniqueLastName = `${testData.lastName}${Date.now()}`;

        await AddEmployeePage.open();
        await AddEmployeePage.addEmployee({
            firstName: testData.firstName,
            lastName: uniqueLastName,
        });

        await AddEmployeePage.personalDetailsHeaderLbl.waitForDisplayed({ timeout: 10000 });
        expect(await browser.getUrl()).toContain('viewPersonalDetails');
        await expect(AddEmployeePage.firstNameTbx).toHaveValue(testData.firstName);
        await expect(AddEmployeePage.lastNameTbx).toHaveValue(uniqueLastName);
    });

    // ADDEMP_TC02 | Severity: A | Priority: High | Validation client-side
    it('ADDEMP_TC02: không cho lưu khi bỏ trống First Name', async () => {
        const testData = addEmployeeData.invalidEmployee.emptyFirstName;

        await AddEmployeePage.open();
        await AddEmployeePage.lastNameTbx.setValue(testData.lastName);
        await AddEmployeePage.saveBtn.click();

        await expect(AddEmployeePage.requiredErrorMsgs).toBeElementsArrayOfSize(1);
        expect(await browser.getUrl()).toContain('addEmployee');
    });

    // ADDEMP_TC03 | Severity: S | Priority: Critical | Tạo tài khoản đăng nhập kèm nhân viên
    it('ADDEMP_TC03: thêm nhân viên kèm tài khoản đăng nhập (ESS)', async () => {
        const testData = addEmployeeData.employeeWithLogin;
        const uniqueSuffix = Date.now();
        const uniqueLastName = `${testData.lastName}${uniqueSuffix}`;
        const uniqueUsername = `${testData.username}${uniqueSuffix}`;

        await AddEmployeePage.open();
        await AddEmployeePage.addEmployee({
            firstName: testData.firstName,
            lastName: uniqueLastName,
            username: uniqueUsername,
            password: testData.password,
        });

        await AddEmployeePage.personalDetailsHeaderLbl.waitForDisplayed({ timeout: 10000 });
        expect(await browser.getUrl()).toContain('viewPersonalDetails');
    });
});
