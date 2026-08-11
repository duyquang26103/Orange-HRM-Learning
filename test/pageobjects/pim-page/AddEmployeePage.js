import Page from '../BasePage.js';

class AddEmployeePage extends Page {
    open() {
        return super.open('pim/addEmployee');
    }

    get firstNameTbx() {
        return $('//input[@name="firstName"]');
    }

    get middleNameTbx() {
        return $('//input[@name="middleName"]');
    }

    get lastNameTbx() {
        return $('//input[@name="lastName"]');
    }

    get employeeIdTbx() {
        return $('//label[text()="Employee Id"]/../following-sibling::div/input');
    }

    get createLoginDetailsCkb() {
        return $('.oxd-switch-input');
    }

    get usernameTbx() {
        return $('//label[text()="Username"]/../following-sibling::div/input');
    }

    get passwordTbx() {
        return $('//label[text()="Password"]/../following-sibling::div/input');
    }

    get confirmPasswordTbx() {
        return $('//label[text()="Confirm Password"]/../following-sibling::div/input');
    }

    get statusEnabledRad() {
        return $('//label[contains(., "Enabled")]//input[@type="radio"]');
    }

    get saveBtn() {
        return $('button[type="submit"]');
    }

    get cancelBtn() {
        return $('.oxd-button--ghost');
    }

    get requiredErrorMsgs() {
        return $$('.oxd-input-field-error-message');
    }

    get firstNameErrorMsg() {
        return $('//input[@name="firstName"]/parent::div/following-sibling::span');
    }

    get successToastLbl() {
        return $('.oxd-toast-content');
    }

    get personalDetailsHeaderLbl() {
        return $('//h6[text()="Personal Details"]');
    }

    async setEmployeeId(employeeId) {
        await expect(this.employeeIdTbx).not.toHaveValue('');
        await this.clearField(this.employeeIdTbx);
        await this.employeeIdTbx.setValue(employeeId);
    }

    async enableLoginDetails(username, password) {
        await this.createLoginDetailsCkb.click();
        await this.usernameTbx.waitForDisplayed();
        await this.usernameTbx.setValue(username);
        await this.passwordTbx.setValue(password);
        await this.confirmPasswordTbx.setValue(password);
    }

    async addEmployee({
        firstName,
        middleName = '',
        lastName,
        employeeId,
        username,
        password,
    } = {}) {
        if (firstName) await this.firstNameTbx.setValue(firstName);
        if (middleName) await this.middleNameTbx.setValue(middleName);
        if (lastName) await this.lastNameTbx.setValue(lastName);
        if (employeeId) await this.setEmployeeId(employeeId);
        if (username && password) await this.enableLoginDetails(username, password);

        await this.saveBtn.click();
    }
}

export default new AddEmployeePage();
