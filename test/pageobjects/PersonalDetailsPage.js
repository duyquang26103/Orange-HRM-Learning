import Page from './BasePage.js';
import ContactDetailsPage from './ContactDetailsPage.js';

class PersonalDetailsPage extends Page {
    get employeeFullName() {
        return $('.orangehrm-edit-employee-name');
    }

    get employeeIdInput() {
        return $("//label[text()='Employee Id']/../following-sibling::div/input");
    }

    get nationalityDropdown() {
        return $("//label[text()='Nationality']/../following-sibling::div//div[contains(@class,'oxd-select-text')]");
    }

    get maritalStatusDropdown() {
        return $("//label[text()='Marital Status']/../following-sibling::div//div[contains(@class,'oxd-select-text')]");
    }

    get btnSave() {
        return $('button[type="submit"]');
    }

    get toast() {
        return $('.oxd-toast');
    }

    get contactDetailsTab() {
        return $('a*=Contact Details');
    }

    /**
     * @param {WebdriverIO.Element} dropdown
     * @param {string} optionText
     */
    async selectDropdownOption(dropdown, optionText) {
        await dropdown.click();
        const option = $(`//div[contains(@class,'oxd-select-dropdown')]//span[text()='${optionText}']`);
        await option.waitForDisplayed();
        await option.click();
    }

    /**
     * @param {string} value
     */
    async setNationality(value) {
        await this.selectDropdownOption(await this.nationalityDropdown, value);
    }

    /**
     * @param {string} value
     */
    async setMaritalStatus(value) {
        await this.selectDropdownOption(await this.maritalStatusDropdown, value);
    }

    async save() {
        await this.btnSave.click();
    }

    async openContactDetailsTab() {
        await this.contactDetailsTab.click();
        await browser.waitUntil(async () => (await browser.getUrl()).includes('contactDetails'), {
            timeout: 15000,
            timeoutMsg: 'Không điều hướng sang Contact Details sau khi click tab'
        });

        await ContactDetailsPage.street1Input.waitForDisplayed({ timeout: 15000 });
    }
}

export default new PersonalDetailsPage();
