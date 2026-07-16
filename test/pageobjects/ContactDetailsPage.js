class ContactDetailsPage {
    get street1Input() {
        return $("//label[text()='Street 1']/../following-sibling::div/input");
    }

    get mobileInput() {
        return $("//label[text()='Mobile']/../following-sibling::div/input");
    }

    get btnSave() {
        return $('button[type="submit"]');
    }

    get requiredErrors() {
        return $$('.oxd-input-field-error-message');
    }

    get toast() {
        return $('.oxd-toast');
    }

    /**
     * @param {string} street
     */
    async setAddress(street) {
        await this.street1Input.setValue(street);
    }

    /**
     * @param {string} phone
     */
    async setMobile(phone) {
        await this.mobileInput.setValue(phone);
        await this.mobileInput.click();
        await browser.keys('Tab');
    }

    async save() {
        await this.btnSave.click();
    }
}

export default new ContactDetailsPage();
