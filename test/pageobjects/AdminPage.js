import { $, $$ } from '@wdio/globals';
import Page from './BasePage.js';

class AdminPage extends Page {
    // --- Elements ---
    get addBtn() { return $('//button[normalize-space()="Add"]'); }
    get userNameTbx() { return $('//label[text()="Username"]/../following-sibling::div//input'); }
    get userRoleDdl() { return $('//label[text()="User Role"]/../following-sibling::div//div[@class="oxd-select-text-input"]'); }
    get searchBtn() { return $('//button[@type="submit"]'); }

    get tblRows() { return $$('.oxd-table-card'); }
    get firstRowCellUsername() { return $('.oxd-table-card:nth-child(1) .oxd-table-cell:nth-child(2) div'); }
    get firstRowBtnDelete() { return $('.oxd-table-card:nth-child(1) .oxd-table-cell:nth-child(6) button:nth-child(1)'); }
    get confirmDeleteBtn() { return $('.oxd-button--label-danger'); }

    dropdownOption(optionText) {
        return $(`//div[@role="listbox"]//*[contains(text(), "${optionText}")]`);
    }


    async searchAndFilterUser(username, role) {
        await this.userNameTbx.setValue(username);
        await this.userRoleDdl.click();
        await this.dropdownOption(role).waitForDisplayed({ timeout: 3000 });
        await this.dropdownOption(role).click();

        await this.searchBtn.click();
        await browser.waitUntil(
            async () => (await this.searchBtn.isClickable()),
            { timeout: 5000, timeoutMsg: 'Bảng không hoàn thành tải dữ liệu' }
        );
    }

    async clickAddUser() {
        await this.addBtn.click();
    }

    async deleteUserInList() {
        await this.firstRowBtnDelete.click();
        await this.confirmDeleteBtn.waitForDisplayed({ timeout: 3000 });
        await this.confirmDeleteBtn.click();
        await this.confirmDeleteBtn.waitForDisplayed({ reverse: true, timeout: 5000 });
    }

    open() {
        return super.open('admin/viewSystemUsers');
    }
}

export default new AdminPage();