import { $, $$ } from '@wdio/globals';
import Page from './BasePage.js';

class AdminPage extends Page {
    // --- Elements ---
    get btnAdd() { return $('//button[normalize-space()="Add"]'); }
    get inputUsername() { return $('//label[text()="Username"]/../following-sibling::div//input'); }
    get dropdownUserRole() { return $('//label[text()="User Role"]/../following-sibling::div//div[@class="oxd-select-text-input"]'); }
    get btnSearch() { return $('//button[@type="submit"]'); }

    // Elements quản lý Bảng kết quả
    get tableRows() { return $$('.oxd-table-card'); }
    get firstRowCellUsername() { return $('.oxd-table-card:nth-child(1) .oxd-table-cell:nth-child(2) div'); }
    get firstRowBtnDelete() { return $('.oxd-table-card:nth-child(1) .oxd-table-cell:nth-child(6) button:nth-child(1)'); }
    get btnConfirmDelete() { return $('.oxd-button--label-danger'); }

    dropdownOption(optionText) { return $(`//div[@role="listbox"]//span[text()="${optionText}"]`); }

    // --- Actions ---
    async searchAndFilterUser(username, role) {
        await this.inputUsername.setValue(username);

        // Chọn role để filter
        await this.dropdownUserRole.click();
        await this.dropdownOption(role).click();

        await this.btnSearch.click();
        await browser.pause(1000);
    }

    async clickAddUser() {
        await this.btnAdd.click();
    }

    async deleteFirstUserInList() {
        await this.firstRowBtnDelete.click();
        await this.btnConfirmDelete.waitForDisplayed({ timeout: 3000 });
        await this.btnConfirmDelete.click();
        await browser.pause(2000);
    }

    open() {
        return super.open('admin/viewSystemUsers');
    }
}

export default new AdminPage();