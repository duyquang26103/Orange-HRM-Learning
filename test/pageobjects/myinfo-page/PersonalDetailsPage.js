import Page from '../BasePage.js';

class PersonalDetailsPage extends Page {
    get headerTitle() {
        return $('//h6[text()="Personal Details"]');
    }
    get emFristNameTbx() {
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
        return $('//label[text()="Nationality"]/../following-sibling::div//div[@class="oxd-select-text-input"]');
    }
    get martialStatusTbx() {
        return $('//label[text()="Marital Status"]/../following-sibling::div//div[@class="oxd-select-text-input"]');
    }
    get dateOfBirthTbx() {
        return $('//label[text()="Date of Birth"]/../following-sibling::div//input');
    }
    // get maleRad() {
    //     return $('//label[contains(., "Male")]/input');
    // }
    // get femaleRad() {
    //     return $('//label[contains(., "Female")]/input');
    // }

    getRadioGender(genderName) {
        return $(`//label[text()="Gender"]/../following-sibling::div//label[contains(., "${genderName}")]//input`);
    }
    get nationalityTbx() {
        return $('//label[text()="Nationality"]/../following-sibling::div//div[@class="oxd-select-text-input"]');
    }
    get savePDBtn() {
        return $('//p[contains(., "Required")]/following-sibling::button]');
    }
    get saveCFBtn() {
        return $('//h6[contains(., "Custom Fields")]/following-sibling::form//button[@type="submit"]');
    }

    get requiredErrorMsg() {
        return $('.oxd-input-field-error-message');
    }

    get successToast() {
        return $('.oxd-toast-content');
    }

    async updateName(first, midle, last) {
        await this.emFristNameTbx.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        if (first) await this.emFristNameTbx.setValue(first);

        await this.emMiddleNameTbx.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        if (midle) await this.emMiddleNameTbx.setValue(midle);

        await this.emLastNameTbx.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        if (last) await this.emMiddleNameTbx.setValue(last);

        await this.savePDBtn.click();

    }

    async updateEmployeeId(empId) {
        await this.employeeIdTbx.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Backspace');
        await this.employeeIdTbx.setValue(empId);
        await this.savePDBtn.click();
    }

    async selectNationality(countryName) {
        await this.nationalityTbx.click();
        const option = await $(`//div[@role="listbox"]//span[text()="${countryName}"]`);
        await option.click();
        await this.savePDBtn.click();
    }

}

export default new PersonalDetailsPage();
