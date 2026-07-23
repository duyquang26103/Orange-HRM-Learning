import Page from './BasePage.js';

class AddEmployeePage extends Page {
    open() {
        return super.open('pim/addEmployee');
    }

    get inputFirstName() {
        return $('input[name="firstName"]');
    }

    get inputMiddleName() {
        return $('input[name="middleName"]');
    }

    get inputLastName() {
        return $('input[name="lastName"]');
    }

    get inputEmployeeId() {
        return $("//label[text()='Employee Id']/../following-sibling::div/input");
    }

    get toggleCreateLoginDetails() {
        return $('.oxd-switch-input');
    }

    get inputUsername() {
        return $("//label[text()='Username']/../following-sibling::div/input");
    }

    get inputPassword() {
        return $("//label[text()='Password']/../following-sibling::div/input");
    }

    get inputConfirmPassword() {
        return $("//label[text()='Confirm Password']/../following-sibling::div/input");
    }

    get btnSave() {
        return $('button[type="submit"]');
    }

    get requiredErrors() {
        return $$('.oxd-input-field-error-message');
    }

    get avatarInput() {
        return $('input[type="file"]');
    }

    get avatarPreview() {
        return $('.employee-image');
    }

    /**
     * @param {{firstName?: string, middleName?: string, lastName?: string}} name
     */
    async fillName({ firstName, middleName, lastName } = {}) {
        if (firstName !== undefined) await this.inputFirstName.setValue(firstName);
        if (middleName) await this.inputMiddleName.setValue(middleName);
        if (lastName !== undefined) await this.inputLastName.setValue(lastName);
    }

    /**
     * @param {string} id
     */
    async setEmployeeId(id) {
        const field = this.inputEmployeeId;

        await browser.waitUntil(async () => (await field.getValue()).length > 0, {
            timeout: 10000,
            timeoutMsg: 'Employee Id mặc định không được điền tự động sau khi chờ'
        });

        await field.click();
        await browser.keys('End');
        await browser.keys(Array(20).fill('Backspace'));
        await browser.keys(id);
        await browser.waitUntil(async () => (await field.getValue()) === id, {
            timeout: 5000,
            timeoutMsg: `Employee Id chưa được set đúng giá trị "${id}"`
        });

        await browser.keys('Tab');

        await browser.keys('Tab');
    }

    async enableCreateLoginDetails() {
        await this.toggleCreateLoginDetails.click();
    }


    async fillLoginDetails({ username, password, confirmPassword }) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.inputConfirmPassword.setValue(confirmPassword ?? password);
        await this.inputConfirmPassword.click();
        await browser.keys('Tab');
    }

    async save() {
        await this.btnSave.click();
    }


    async uploadAvatar(filePath) {

        await browser.execute(() => {
            const el = document.querySelector('input[type="file"]');
            if (el) {
                el.style.opacity = '1';
                el.style.display = 'block';
                el.style.width = '50px';
                el.style.height = '50px';
            }
        });
        await this.avatarInput.addValue(filePath);
    }
}

export default new AddEmployeePage();
