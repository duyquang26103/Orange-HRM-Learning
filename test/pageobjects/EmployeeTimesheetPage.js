import Page from "./BasePage.js";

class EmployeeTimesheetPage extends Page {
  open() {
    return super.open("time/viewEmployeeTimesheet");
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
  get invalidLbl() {
    return $(".oxd-input-field-error-message");
  }
  get timesheetTitleLbl() {
    return $('//h6[contains(normalize-space(),"Timesheet for")]');
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

  async searchEmployee(name) {
    await this.employeeNameTxb.setValue(name);
    await this.waitForRealOption();
    const picked = await this.firstOpt.getText();
    await this.firstOpt.click();
    return picked;
  }

  async viewTimesheet() {
    await this.viewBtn.click();
    await this.timesheetTitleLbl.waitForDisplayed({ timeout: 10000 });
  }
}

export default new EmployeeTimesheetPage();
