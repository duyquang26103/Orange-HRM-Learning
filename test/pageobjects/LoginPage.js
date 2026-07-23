import Page from './BasePage.js';

class LoginPage extends Page {
    get inputUsername() {
        return $('//input[@name="username"]');
    }

    get inputPassword() {
        return $('//input[@name="password"]');
    }

    get btnSubmit() {
        return $('button[type="submit"]');
    }

    get errorAlert() {
        return $('.oxd-alert-content-text');
    }

    get requiredErrors() {
        return $$('.oxd-input-field-error-message');
    }

    get forgotPasswordLink() {
        return $('.orangehrm-login-forgot');
    }

    open() {
        return super.open('auth/login');
    }

    async setUsername(username) {
        await this.inputUsername.setValue(username);
    }

    async setPassword(password) {
        await this.inputPassword.setValue(password);
    }

    async clickLogin() {
        await this.btnSubmit.click();
    }


    async login(username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }


    async getErrorText() {
        return this.errorAlert.getText();
    }

    async getRequiredErrorCount() {
        const errors = await this.requiredErrors;
        return errors.length;
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
    }
}

export default new LoginPage();
