// test/pageobjects/AddUserPage.js
import { $ } from '@wdio/globals';
import Page from './BasePage.js';

class AddUserPage extends Page {
    get userRoleDdl() { return $('//label[text()="User Role"]/../following-sibling::div//div[@class="oxd-select-text-input"]'); }
    get employeeNameTbx() { return $('//label[text()="Employee Name"]/../following-sibling::div//input'); }
    get statusDdl() { return $('//label[text()="Status"]/../following-sibling::div//div[@class="oxd-select-text-input"]'); }
    get inputUsername() { return $('//label[text()="Username"]/../following-sibling::div//input'); }
    get inputPassword() { return $('//label[text()="Password"]/../following-sibling::div//input'); }
    get inputConfirmPassword() { return $('//label[text()="Confirm Password"]/../following-sibling::div//input'); }
    get saveBtn() { return $('button[type="submit"]'); }
    get requiredUsernameMsg() {
        // Đi ngược lên thẻ cha bao bọc toàn bộ cụm Input, sau đó tìm thẻ span lỗi bên dưới nó
        return $('//label[text()="Username"]/ancestor::div[contains(@class, "oxd-input-group")]//span[contains(@class, "oxd-input-field-error-message")]');
    }
    get duplicateUsernameMsg() {
        // Đi từ label Username -> lên khung bao bọc -> xuống thẻ span hiển thị lỗi
        return $('//label[text()="Username"]/ancestor::div[contains(@class, "oxd-input-group")]//span[contains(@class, "oxd-input-field-error-message")]');
    }


    userRoleOption(roleName) {
        return $(`//div[@role="listbox"]//span[text()="${roleName}"]`);
    }


    employeeSuggestionItem(empName) {
        return $(`//div[@role="listbox"]//span[text()="${empName}"]`);
    }

    statusOption(statusName) {
        return $(`//div[@role="listbox"]//span[text()="${statusName}"]`);
    }

    async createUser(role, empName, status, username, password) {

        await this.userRoleDdl.click();
        await this.userRoleOption(role).waitForDisplayed({ timeout: 3000 });
        await this.userRoleOption(role).click();


        await this.employeeNameTbx.setValue(empName);
        await this.employeeSuggestionItem(empName).waitForDisplayed({
            timeout: 5000,
            timeoutMsg: `Không tìm thấy gợi ý nào chứa tên nhân viên: ${empName}`
        });
        await this.employeeSuggestionItem(empName).click();


        await this.statusDdl.click();
        await this.statusOption(status).waitForDisplayed({ timeout: 3000 });
        await this.statusOption(status).click();


        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.inputConfirmPassword.setValue(password);


        await this.saveBtn.click();
    }
}

export default new AddUserPage();