import Page from '../BasePage.js';

class AvatarPage extends Page {
    get headerTitle() {
        return $('//h6[text()="Change Profile Picture"]');
    }
    get editAvatarBtn() {
        return $('.orangehrm-edit-employee-image');
    }
    get fileTbx() {
        return $('input.oxd-file-input');
    }
    get saveBtn() {
        return $('button[type="submit"]');
    }
    get errorMsg() {
        return $('.oxd-input-field-error-message');
    }
    get successToast() {
        return $('.oxd-toast-content');
    }
    get avatarImg() {
        return $('.employee-image-wrapper .employee-image');
    }

    async uploadFile(filePath) {
        const input = await this.fileTbx.getElement();
        await browser.elementSendKeys(input.elementId, filePath);
        await browser.waitUntil(
            async () =>
                (await this.avatarImg.getAttribute('src')).startsWith('data:') ||
                (await this.errorMsg.isExisting()),
            { timeoutMsg: 'File selection was not processed by the form' }
        );
    }

    async uploadAndSave(filePath) {
        await this.uploadFile(filePath);
        await this.saveBtn.click();
    }
}

export default new AvatarPage();
