import Page from './BasePage.js';

class LoginPage extends Page {
    get usernameTbx() {
        return $('//input[@name="username"]');
    }

    get passwordTbx() {
        return $('//input[@name="password"]');
    }

    get submitBtn() {
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
        await this.usernameTbx.setValue(username);
    }

    async setPassword(password) {
        await this.passwordTbx.setValue(password);
    }

    async clickLogin() {
        await this.submitBtn.click();
    }


    async login(username, password) {
        await this.usernameTbx.setValue(username);
        await this.passwordTbx.setValue(password);
        await this.submitBtn.click();
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
