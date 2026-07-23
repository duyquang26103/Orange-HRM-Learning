// test/pageobjects/AddEmployeePage.js
import { $ } from '@wdio/globals';
import Page from './BasePage.js';

class AddEmployeePage extends Page {
    // --- Elements ---
    get firstNameTbx() { return $('input[name="firstName"]'); }
    get middleNameTbx() { return $('input[name="middleName"]'); }
    get lastNameTbx() { return $('input[name="lastName"]'); }

    // Ô Employee ID (Thường OrangeHRM tự sinh, nhưng ta có thể ghi đè)
    get employeeIdTbx() { return $('//label[text()="Employee Id"]/../following-sibling::div//input'); }
    get saveBtn() { return $('button[type="submit"]'); }

    // Header hiển thị tên nhân viên sau khi tạo thành công (Trang Personal Details)
    get employeeProfileHeader() { return $('.orangehrm-edit-employee-name h6'); }

    // --- Action ---
    async createFullEmployee(firstName, middleName, lastName, empId) {
        await this.firstNameTbx.setValue(firstName);
        await this.middleNameTbx.setValue(middleName);
        await this.lastNameTbx.setValue(lastName);

        if (empId) {
            // Xóa ID tự sinh mặc định và điền ID tùy chỉnh
            await this.employeeIdTbx.click();
            await browser.keys(['Control', 'a']);
            await browser.keys(['Backspace']);
            await this.employeeIdTbx.setValue(empId);
        }

        await this.saveBtn.click();
    }
}

export default new AddEmployeePage();