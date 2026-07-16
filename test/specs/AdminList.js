// test/specs/AdminList.js
import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/LoginPage.js';
import AdminPage from '../pageobjects/AdminPage.js';
import AddUserPage from '../pageobjects/AddUserPage.js';
// 1. Import SideMenuComponent vào file test
import SideMenuComponent from '../pageobjects/components/SideMenuComponent.js';

describe('Admin Management — Split Test Cases', () => {

    let testUsername;
    const employeeName = 'Albert  Einstein';

    before(async () => {
        await browser.maximizeWindow();
        const randomStr = Math.random().toString(36).substring(2, 7);
        testUsername = `TestUser_${randomStr}`;

        await LoginPage.open();
        await LoginPage.login('Admin', 'admin123');

        await SideMenuComponent.goTo('Admin');
    });

    it.only('TC_01: Tạo thành công User mới với quyền ESS', async () => {
        await AdminPage.clickAddUser();
        await AddUserPage.createUser('ESS', employeeName, 'Enabled', testUsername, 'Password123!');

        //điều hướng quay lại trang Admin
        await expect(browser).toHaveUrl(expect.stringContaining('admin/viewSystemUsers'));
    });

    it.only('TC_02: Tìm kiếm User theo chính xác Username', async () => {

        await AdminPage.inputUsername.waitForEnabled({ timeout: 5000 });
        await AdminPage.inputUsername.setValue(testUsername);
        await AdminPage.btnSearch.click();
        //  await browser.pause(3000);
        await AdminPage.tableRows[0].waitForDisplayed({ timeout: 5000 });

        // Kiểm tra xem dòng đầu tiên có đúng tên user vừa tạo không
        await expect(AdminPage.firstRowCellUsername).toHaveText(testUsername);
    });

    it.only('TC_03: Lọc danh sách (Filter) theo User Role', async () => {
        await SideMenuComponent.goTo('Admin');

        await AdminPage.inputUsername.setValue('');

        // Chọn filter theo role ESS
        await AdminPage.dropdownUserRole.click();
        await AdminPage.dropdownOption('ESS').click();
        await AdminPage.btnSearch.click();
        await AdminPage.tableRows[0].waitForDisplayed({ timeout: 5000 });

        // Verify danh sách trả về hiển thị (ít nhất là lớn hơn hoặc bằng 1)
        const rowCount = await AdminPage.tableRows.length;
        await expect(rowCount).toBeGreaterThanOrEqual(1);
    });

    it('TC_04: Xác thực (Verify) User vừa tạo hiển thị duy nhất 1 kết quả', async () => {
    });

    it('TC_05: Xóa (Delete) User vừa tạo và verify sạch dữ liệu', async () => {

    });
});