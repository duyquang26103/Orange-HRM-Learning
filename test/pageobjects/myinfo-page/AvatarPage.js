import Page from '../BasePage.js';

class AvatarPage extends Page {
    get headerTitle() {
        return $('//h6[text()="Change Profile Picture"]');
    }
    get editImageBtn() {
        return $('.orangehrm-edit-employee-image');
    }
    get fileInput() {
        return $('input.oxd-file-input');
    }
    get saveBtn() {
        return $('//button[@type="submit"]');
    }
    get errorMsg() {
        return $('.oxd-input-field-error-message');
    }
    get successToast() {
        return $('.oxd-toast-content');
    }
    get avatarImage() {
        return $('.employee-image-wrapper .employee-image');
    }

    async openChangeAvatarForm() {
        await this.editImageBtn.click();
        await this.headerTitle.waitForDisplayed({ timeout: 5000 });
    }

    async uploadFile(filePath) {
        const input = await this.fileInput;
        await browser.elementSendKeys(input.elementId, filePath);
        await browser.waitUntil(
            async () =>
                (await this.avatarImage.getAttribute('src')).startsWith('data:') ||
                (await this.errorMsg.isExisting()),
            { timeout: 5000, timeoutMsg: 'File selection was not processed by the form' }
        );
    }

    async uploadAndSave(filePath) {
        await this.uploadFile(filePath);
        await this.saveBtn.click();
    }
}

export default new AvatarPage();
