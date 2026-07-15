// test/pageobjects/AddUserPage.js
import { $ } from '@wdio/globals';
import Page from './BasePage.js';

class AddUserPage extends Page {
    // --- Elements ---
    get dropdownUserRole() { return $('//label[text()="User Role"]/../following-sibling::div//div[@class="oxd-select-text-input"]'); }
    get inputEmployeeName() { return $('//label[text()="Employee Name"]/../following-sibling::div//input'); }
    get dropdownStatus() { return $('//label[text()="Status"]/../following-sibling::div//div[@class="oxd-select-text-input"]'); }
    get inputUsername() { return $('//label[text()="Username"]/../following-sibling::div//input'); }
    get inputPassword() { return $('//label[text()="Password"]/../following-sibling::div//input'); }
    get inputConfirmPassword() { return $('//label[text()="Confirm Password"]/../following-sibling::div//input'); }
    get btnSave() { return $('button[type="submit"]'); }

    // Helper định vị item trong dropdown tùy biến của OrangeHRM
    dropdownOption(optionText) { return $(`//div[@role="listbox"]//span[text()="${optionText}"]`); }

    // --- Actions ---
    async createUser(role, empName, status, username, password) {
        // Chọn User Role
        await this.dropdownUserRole.click();
        await this.dropdownOption(role).click();

        // Gõ tên Employee và chọn từ gợi ý auto-complete
        await this.inputEmployeeName.setValue(empName);
        await browser.pause(2000); // Chờ gợi ý hiển thị
        await this.dropdownOption(empName).click();

        // Chọn Status
        await this.dropdownStatus.click();
        await this.dropdownOption(status).click();

        // Điền text fields
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.inputConfirmPassword.setValue(password);

        // Lưu thông tin
        await this.btnSave.click();
        await browser.pause(2000); // Chờ hệ thống lưu thành công và redirect về trang Admin
    }
}

export default new AddUserPage();