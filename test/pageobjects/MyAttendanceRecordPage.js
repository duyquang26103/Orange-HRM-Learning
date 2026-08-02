import Page from "./BasePage.js";

class MyAttendanceRecordPage extends Page {
  open() {
    return super.open("attendance/viewMyAttendanceRecord");
  }

  get tableBody() {
    return $(".oxd-table-body");
  }
  get firstEditBtn() {
    return $('(//button[.//i[contains(@class,"bi-pencil-fill")]])[1]');
  }
  get timeTxb() {
    return $('(//label[text()="Time"]/../..//input)[1]');
  }
  get saveBtn() {
    return $('//button[normalize-space()="Save"]');
  }

  get editHeaderLbl() {
    return $('//h6[normalize-space()="Edit Attendance Records"]');
  }

  async editFirstRecord() {
    await this.firstEditBtn.waitForDisplayed({ timeout: 15000 });
    await this.firstEditBtn.click();
    await this.timeTxb.waitForDisplayed({ timeout: 10000 });
  }

  async setPunchTime(time) {
    await this.timeTxb.click();
    await browser.keys(["Control", "a"]);
    await browser.keys(time);
    await this.editHeaderLbl.click();
  }

  async saveRecord() {
    await this.saveBtn.click();
    await this.tableBody.waitForDisplayed({ timeout: 30000 });
  }
  get selectAllCkb() {
    return $('(//i[contains(@class,"oxd-checkbox-input-icon")])[1]');
  }
  get deleteSelectedBtn() {
    return $('//button[normalize-space()="Delete Selected"]');
  }
  get confirmDeleteBtn() {
    return $('//button[normalize-space()="Yes, Delete"]');
  }
  get noRecordsLbl() {
    return $('//*[normalize-space()="No Records Found"]');
  }

  async clearTodayRecords() {
    await this.open();
    await browser.waitUntil(
      async () =>
        (await this.tableBody.isDisplayed()) ||
        (await this.noRecordsLbl.isDisplayed()),
      { timeout: 15000, timeoutMsg: "My Records khong render" },
    );
    if (await this.noRecordsLbl.isDisplayed()) return;
    await this.selectAllCkb.click();
    await this.deleteSelectedBtn.waitForDisplayed({ timeout: 10000 });
    await this.deleteSelectedBtn.click();
    await this.confirmDeleteBtn.waitForDisplayed({ timeout: 10000 });
    await this.confirmDeleteBtn.click();
    await this.noRecordsLbl.waitForDisplayed({ timeout: 15000 });
  }
}

export default new MyAttendanceRecordPage();
