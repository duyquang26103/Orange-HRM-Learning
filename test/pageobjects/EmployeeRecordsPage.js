import Page from "./BasePage.js";

class EmployeeRecordsPage extends Page {
  open() {
    return super.open("attendance/viewAttendanceRecord");
  }

  get userNameLbl() {
    return $(".oxd-userdropdown-name");
  }
  get employeeNameTxb() {
    return $('//input[@placeholder="Type for hints..."]');
  }
  get viewBtn() {
    return $('//button[normalize-space()="View"]');
  }
  get firstOpt() {
    return $('(//div[@role="option"])[1]');
  }
  get tableBody() {
    return $(".oxd-table-body");
  }
  get noRecordsLbl() {
    return $('//div[normalize-space()="No Records Found"]');
  }

  async waitForRealOption() {
    await browser.waitUntil(
      async () => {
        const shown = await this.firstOpt.isDisplayed();
        if (!shown) return false;
        const text = await this.firstOpt.getText();
        return (
          text.length > 0 &&
          !text.includes("Searching") &&
          !text.includes("No Records Found")
        );
      },
      { timeout: 12000, timeoutMsg: "Autocomplete khong tra ve option that" },
    );
  }

  async searchEmployee(hint) {
    await this.employeeNameTxb.setValue(hint);
    await this.waitForRealOption();
    await this.firstOpt.click();
  }

  async viewRecords() {
    await this.viewBtn.click();
    await browser.waitUntil(
      async () =>
        (await this.tableBody.isDisplayed()) ||
        (await this.noRecordsLbl.isDisplayed()),
      { timeout: 10000, timeoutMsg: "Ket qua records khong render" },
    );
  }
}

export default new EmployeeRecordsPage();
