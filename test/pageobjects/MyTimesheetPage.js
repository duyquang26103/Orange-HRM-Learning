import Page from "./BasePage.js";

class MyTimesheetPage extends Page {
  open(startDate) {
    const path = startDate
      ? `time/viewMyTimesheet?startDate=${startDate}`
      : "time/viewMyTimesheet";
    return super.open(path);
  }

  get prevBtn() {
    return $(".oxd-icon-button.orangehrm-timeperiod-icon.--prev");
  }
  get periodTxb() {
    return $(".orangehrm-timesheet-header--options input");
  }

  async goToPreviousWeek() {
    const before = await this.periodTxb.getValue();
    await this.prevBtn.click();
    await browser.waitUntil(
      async () => (await this.periodTxb.getValue()) !== before,
      { timeout: 10000, timeoutMsg: "Period khong doi sau khi bam prev" },
    );
  }

  async findPastWeekWithCreate(maxWeeks = 5) {
    for (let i = 0; i < maxWeeks; i++) {
      await this.goToPreviousWeek();
      await browser.waitUntil(
        async () =>
          (await this.timesheetTbl.isDisplayed()) ||
          (await this.noTimesheetLbl.isDisplayed()),
        { timeout: 10000, timeoutMsg: "Noi dung tuan moi khong render" },
      );
      if (await this.createTimesheetBtn.isDisplayed()) {
        return true;
      }
    }
    return false;
  }

  get createTimesheetBtn() {
    return $('//button[normalize-space()="Create Timesheet"]');
  }
  get noTimesheetLbl() {
    return $('//p[text()="No Timesheets Found"]');
  }
  get noRecordsLbl() {
    return $('//td[normalize-space()="No Records Found"]');
  }
  get timesheetTbl() {
    return $(".orangehrm-timesheet-table");
  }
  get editBtn() {
    return $('//button[normalize-space()="Edit"]');
  }
  get submitBtn() {
    return $('//button[normalize-space()="Submit"]');
  }
  get statusLbl() {
    return $('//p[contains(normalize-space(),"Status")]');
  }

  async createTimesheet() {
    await this.createTimesheetBtn.click();
    await this.timesheetTbl.waitForDisplayed({ timeout: 10000 });
  }

  async ensureEmptyTimesheetAt(startDate) {
    await this.open(startDate);
    await browser.waitUntil(
      async () =>
        (await this.timesheetTbl.isDisplayed()) ||
        (await this.noTimesheetLbl.isDisplayed()),
      { timeout: 10000, timeoutMsg: "Noi dung tuan khong render" },
    );
    if (await this.noRecordsLbl.isDisplayed()) return true;
    if (await this.createTimesheetBtn.isDisplayed()) {
      await this.createTimesheet();
      return true;
    }
    return false;
  }

  async submitTimesheet() {
    await this.submitBtn.click();
    await browser.waitUntil(
      async () => !(await this.statusLbl.getText()).includes("Not Submitted"),
      { timeout: 10000, timeoutMsg: "Status khong doi sau khi Submit" },
    );
  }

  get projectTxb() {
    return $('//input[@placeholder="Type for hints..."]');
  }
  get secondOpt() {
    return $('(//div[@role="option"])[2]');
  }
  get activityDdn() {
    return $(".oxd-select-text");
  }
  get hourTxbs() {
    return $$("//table//input[not(@placeholder)]");
  }
  get hourErrorLbl() {
    return $(".oxd-input-field-error-message");
  }
  get saveBtn() {
    return $('//button[normalize-space()="Save"]');
  }

  async waitForRealOption() {
    await browser.waitUntil(
      async () => {
        const shown = await this.secondOpt.isDisplayed();
        if (!shown) return false;
        const text = await this.secondOpt.getText();
        return (
          text.length > 0 &&
          !text.includes("Searching") &&
          !text.includes("No Records Found")
        );
      },
      { timeout: 12000, timeoutMsg: "Danh sach khong tra ve option that" },
    );
  }

  async selectProject(hint, attempts = 3) {
    for (let i = 1; i <= attempts; i++) {
      await this.projectTxb.setValue(hint);
      try {
        await this.waitForRealOption();
        await this.secondOpt.click();
        return;
      } catch (err) {
        if (i === attempts) throw err;
        console.log(`autocomplete retry ${i + 1}...`);
      }
    }
  }

  async selectActivity() {
    await this.activityDdn.click();
    await this.waitForRealOption();
    await this.secondOpt.click();
  }

  async enterHours(dayIndex, hours) {
    const inputs = await this.hourTxbs;
    await inputs[dayIndex].setValue(hours);
  }

  async saveTimesheet() {
    await this.saveBtn.click();
    await this.editBtn.waitForDisplayed({ timeout: 10000 });
  }
}

export default new MyTimesheetPage();
