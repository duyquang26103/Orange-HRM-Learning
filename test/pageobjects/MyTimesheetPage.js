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

  get createTimesheetBtn() {
    return $('//button[normalize-space()="Create Timesheet"]');
  }
  get noTimesheetLbl() {
    return $('//p[text()="No Timesheets Found"]');
  }
  get timesheetTbl() {
    return $(".orangehrm-timesheet-table");
  }

  async goToPreviousWeek() {
    const before = await this.periodTxb.getValue();
    await this.prevBtn.click();
    await browser.waitUntil(
      async () => (await this.periodTxb.getValue()) !== before,
      { timeout: 10000, timeoutMsg: "Period không đổi sau khi bấm prev" },
    );
  }

  async findPastWeekWithCreate(maxWeeks = 5) {
    for (let i = 0; i < maxWeeks; i++) {
      await this.goToPreviousWeek();

      await browser.waitUntil(
        async () =>
          (await this.timesheetTbl.isDisplayed()) ||
          (await this.noTimesheetLbl.isDisplayed()),
        { timeout: 10000, timeoutMsg: "Nội dung tuần mới không render" },
      );
      if (await this.createTimesheetBtn.isDisplayed()) {
        return true;
      }
    }
    return false;
  }

  async createTimesheet() {
    await this.createTimesheetBtn.click();
    await this.timesheetTbl.waitForDisplayed({ timeout: 10000 });
  }
}

export default new MyTimesheetPage();
