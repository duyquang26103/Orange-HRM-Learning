import Page from '../BasePage.js';

class ContactDetailsPage extends Page {
    get headerTitle() {
        return $('//h6[text()="Contact Details"]');
    }
    get street1Tbx() {
        return $('//label[text()="Street 1"]/parent::div/following-sibling::div/input');
    }
    get cityTbx() {
        return $('//label[text()="City"]/parent::div/following-sibling::div/input');
    }
    get mobileTbx() {
        return $('//label[text()="Mobile"]/parent::div/following-sibling::div/input');
    }
    get workEmailTbx() {
        return $('//label[text()="Work Email"]/parent::div/following-sibling::div/input');
    }

    get saveBtn() {
        return $('//p[contains(@class, "orangehrm-form-hint")]/following-sibling::button');
    }
    
    get emailErrorMsg() {
        return $('//label[text()="Work Email"]/parent::div/following-sibling::span');
    }

    get phoneErrorMsg() {
        return $('//label[text()="Mobile"]/parent::div/following-sibling::span');
    }

    get successToast() {
        return $('.oxd-toast-content');
    }

    async waitForFormLoaded() {
        await this.headerTitle.waitForDisplayed({ timeout: 5000 });
        await browser.waitUntil(async () => (await this.street1Tbx.getValue()) !== '', {
            timeout: 5000,
            timeoutMsg: 'Contact details form did not finish loading',
        });
    }

    async updateContact(street, city, phone) {
        await this.waitForFormLoaded();
        await this.clearField(this.street1Tbx);
        if (street) await this.street1Tbx.setValue(street);

        await this.clearField(this.cityTbx);
        if (city) await this.cityTbx.setValue(city);

        await this.clearField(this.mobileTbx);
        if (phone) await this.mobileTbx.setValue(phone);

        await this.saveBtn.click();
    }
}

export default new ContactDetailsPage();
