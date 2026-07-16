import Page from './BasePage.js';

class EmployeeListPage extends Page {
  open() {
    return super.open('pim/viewEmployeeList');
  }

  get employeeNameTbx() {
    return $("//label[text()='Employee Name']/../following-sibling::div//input")
  }

  get nameSuggestionOptions() {
    return $$(".oxd-autocomplete-dropdown[role='listbox'] .oxd-autocomplete-option")
  }

  get submitBtn() {
    return $("//button[@type='submit']")
  }

  get employeeRows() {
    return $$("//div[@class='oxd-table-body']//div[@role='row']")
  }

  get employeeIdTbx() {
    return $("//label[text()='Employee Id']/../following-sibling::div/input")
  }

  get firstRow() {
    return $("(//div[@class='oxd-table-body']//div[@role='row'])[1]")
  }

  rowDeleteBtn(rowIndex) {
    return $(`(//div[@class='oxd-table-body']//div[@role='row'])[${rowIndex}]//button[.//i[contains(@class,'bi-trash')]]`)
  }

  get firstRowDeleteBtn() {
    return this.rowDeleteBtn(1)
  }

  get confirmDeleteBtn() {
    return $('button=Yes, Delete')
  }

  get cancelDeleteBtn() {
    return $('button=No, Cancel')
  }

  get deleteSelectedBtn() {
    return $('button=Delete Selected')
  }

  get resetBtn() {
    return $('button=Reset')
  }

  get noRecordsText() {
    return $('=No Records Found')
  }

  get toastMessage() {
    return $('.oxd-toast')
  }

  get paginationPageItems() {
    return $$('.oxd-pagination-page-item')
  }

  rowIdCell(rowIndex) {
    return $(`(//div[@class='oxd-table-body']//div[@role='row'])[${rowIndex}]//div[@role='cell'][count(//div[@role='columnheader'][text()[normalize-space(.)='Id']]/preceding-sibling::div[@role='columnheader'])+1]`)
  }

  get firstRowIdCell() {
    return this.rowIdCell(1)
  }

  rowCheckbox(rowIndex) {
    return $(`(//div[@class='oxd-table-body']//div[@role='row'])[${rowIndex}]//i[contains(@class,'oxd-checkbox-input-icon')]`)
  }

  async searchEmployeeByName(name) {
    await this.employeeNameTbx.setValue(name);
    await this.submitBtn.click();
  }

  async searchEmployeeById(id) {
    await this.employeeIdTbx.setValue(id);
    await this.submitBtn.click();
  }

  async openFirstRecord() {
    await this.firstRow.click();
  }

  async deleteFirstRecord() {
    await this.firstRowDeleteBtn.click();
    await this.confirmDeleteBtn.waitForDisplayed();
    await this.confirmDeleteBtn.click();
  }

  async cancelDeleteFirstRecord() {
    await this.firstRowDeleteBtn.click();
    await this.cancelDeleteBtn.waitForDisplayed();
    await this.cancelDeleteBtn.click();
  }

  async selectRows(count) {
    for (let i = 1; i <= count; i++) {
      await this.rowCheckbox(i).click();
    }
  }

  async deleteSelectedRecords() {
    await this.deleteSelectedBtn.click();
    await this.confirmDeleteBtn.waitForDisplayed();
    await this.confirmDeleteBtn.click();
  }

  async reset() {
    await this.resetBtn.click();
  }

  async goToPage(pageNumber) {
    const pages = await this.paginationPageItems;
    for (const page of pages) {
      if ((await page.getText()) === String(pageNumber)) {
        await page.click();
        return;
      }
    }
    throw new Error(`Không tìm thấy trang số ${pageNumber} trong phân trang`);
  }

  async getFirstRowId() {
    return (await this.firstRowIdCell.getText()).trim();
  }

  async getCurrentEmployeeRecords() {
    return this.employeeRows.length;
  }
}

export default new EmployeeListPage();
