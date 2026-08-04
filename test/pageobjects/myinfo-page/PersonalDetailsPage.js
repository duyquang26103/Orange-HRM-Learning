import Page from '../BasePage.js';

class PersonalDetailsPage extends Page {
    get headerTitle() {
        return $('//h6[text()="Personal Details"]');
    }
    get emFirstNameTbx() {
        return $('//input[@name="firstName"]');
    }
    get emMiddleNameTbx() {
        return $('//input[@name="middleName"]');
    }
    get emLastNameTbx() {
        return $('//input[@name="lastName"]');
    }
    get nickNameTbx() {
        return $('//label[text()="Nickname"]/../following-sibling::div/input');
    }
    get employeeIdTbx() {
        return $('//label[text()="Employee Id"]/../following-sibling::div/input');
    }
    get otherIdTbx() {
        return $('//label[text()="Other Id"]/../following-sibling::div/input');
    }
    get driverLicenseNumTbx() {
        return $(`//label[text()="Driver's License Number"]/../following-sibling::div/input`);
    }
    get licenseExpiryDateTbx() {
        return $('//label[text()="License Expiry Date"]/../following-sibling::div//input');
    }
    get ssnNumberTbx() {
        return $('//label[text()="SSN Number"]/../following-sibling::div/input');
    }
    get sinNumberTbx() {
        return $('//label[text()="SIN Number"]/../following-sibling::div/input');
    }
    get nationalityTbx() {
        return $(
            '//label[text()="Nationality"]/../following-sibling::div//div[@class="oxd-select-text-input"]'
        );
    }
    get martialStatusTbx() {
        return $(
            '//label[text()="Marital Status"]/../following-sibling::div//div[@class="oxd-select-text-input"]'
        );
    }
    get dateOfBirthTbx() {
        return $('//label[text()="Date of Birth"]/../following-sibling::div//input');
    }

    getRadioGender(genderName) {
        return $(
            `//label[text()="Gender"]/../following-sibling::div//label[text()= "${genderName}"]//input`
        );
    }
    get savePersonalDetailsBtn() {
        return $('//p[contains(@class, "orangehrm-form-hint")]/following-sibling::button');
    }
    get saveCustomFieldsBtn() {
        return $('//h6[text()=  "Custom Fields"]/following-sibling::form//button[@type="submit"]');
    }

    get requiredErrorMsg() {
        return $('.oxd-input-field-error-message');
    }

    get successToast() {
        return $('.oxd-toast-content');
    }

    async updateName(first, midle, last) {
        await expect(this.emFirstNameTbx).not.toHaveValue('');

        await this.clearField(this.emFirstNameTbx);
        if (first) await this.emFirstNameTbx.setValue(first);

        await this.clearField(this.emMiddleNameTbx);
        if (midle) await this.emMiddleNameTbx.setValue(midle);

        await this.clearField(this.emLastNameTbx);
        if (last) await this.emLastNameTbx.setValue(last);

        await this.savePersonalDetailsBtn.click();
    }

    async updateEmployeeId(empId) {
        await this.clearField(this.employeeIdTbx);
        await this.employeeIdTbx.setValue(empId);
        await this.savePersonalDetailsBtn.click();
    }

    async selectDropdownOption(dropdownEl, optionText) {
        await dropdownEl.click();
        const option = await $(`//div[@role="listbox"]//span[text()="${optionText}"]`);
        await option.click();
        await this.savePersonalDetailsBtn.click();
    }

    async selectNationality(countryName) {
        return this.selectDropdownOption(this.nationalityTbx, countryName);
    }

    async selectMaritalStatus(status) {
        return this.selectDropdownOption(this.martialStatusTbx, status);
    }

    async updateDateOfBirth(dob) {
        await this.clearField(this.dateOfBirthTbx);
        await this.dateOfBirthTbx.setValue(dob);
        await browser.keys(['Escape']);
        await this.savePersonalDetailsBtn.click();
    }

    async selectGender(genderName) {
        const radio = await this.getRadioGender(genderName);
        await browser.execute((el) => el.click(), radio);
        await this.savePersonalDetailsBtn.click();
    }
}

export default new PersonalDetailsPage();
