import DashboardPage from "../pageobjects/DashboardPage.js";
import LoginPage from "../pageobjects/LoginPage.js";
import PunchInOutPage from "../pageobjects/PunchInOutPage.js";
import MyTimesheetPage from "../pageobjects/MyTimesheetPage.js";

function randomPastMonday() {
  const weeksBack = 100 + Math.floor(Math.random() * 200);
  const d = new Date();
  const diffToMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diffToMonday - weeksBack * 7);
  return d.toISOString().slice(0, 10);
}

async function arrangeEmptyTimesheet(tries = 3) {
  for (let i = 0; i < tries; i++) {
    if (await MyTimesheetPage.ensureEmptyTimesheetAt(randomPastMonday()))
      return true;
  }
  return false;
}

async function arrangeEditableTimesheet() {
  if (!(await arrangeEmptyTimesheet())) return false;
  await MyTimesheetPage.editBtn.click();
  await MyTimesheetPage.selectProject("a");
  await MyTimesheetPage.selectActivity();
  return true;
}

async function arrangeTimesheetWithHours() {
  if (!(await arrangeEditableTimesheet())) return false;
  for (let day = 0; day < 5; day++) {
    await MyTimesheetPage.enterHours(day, "8");
  }
  await MyTimesheetPage.saveTimesheet();
  return true;
}

describe("Time Module", () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login("Admin", "admin123");
    await DashboardPage.dashboardTag.waitForDisplayed({ timeout: 10000 });
  });

  it("TIME_TC01: Tạo Timesheet mới cho tuần chưa có", async function () {
    await MyTimesheetPage.open();
    const found = await MyTimesheetPage.findPastWeekWithCreate(5);
    if (!found) {
      this.skip();
    }

    await MyTimesheetPage.createTimesheet();

    await expect(MyTimesheetPage.timesheetTbl).toBeDisplayed();
    await expect(MyTimesheetPage.noTimesheetLbl).not.toBeDisplayed();
  });

  it("TIME_TC02: Nhập giờ làm việc vào Timesheet", async function () {
    if (!(await arrangeEmptyTimesheet())) this.skip();

    await MyTimesheetPage.editBtn.click();
    await MyTimesheetPage.selectProject("a");
    await MyTimesheetPage.selectActivity();
    await MyTimesheetPage.enterHours(0, "8");
    await MyTimesheetPage.enterHours(1, "8");
    await MyTimesheetPage.saveTimesheet();

    await expect(MyTimesheetPage.timesheetTbl).toHaveText(
      expect.stringContaining("16:00"),
    );
  }).timeout(120000);

  it("TIME_TC03: Submit Timesheet để duyệt", async function () {
    if (!(await arrangeTimesheetWithHours())) this.skip();

    await MyTimesheetPage.submitTimesheet();

    await expect(MyTimesheetPage.statusLbl).toHaveText("Status: Submitted");
    await expect(MyTimesheetPage.submitBtn).not.toBeDisplayed();
  }).timeout(120000);

  it("TIME_TC04: Nhập giờ chứa ký tự chữ", async function () {
    if (!(await arrangeEditableTimesheet())) this.skip();

    await MyTimesheetPage.enterHours(0, "abc");

    await expect(MyTimesheetPage.hourErrorLbl).toBeDisplayed();
    await expect(MyTimesheetPage.hourErrorLbl).toHaveText(
      expect.stringContaining("Less Than 24"),
    );

    await MyTimesheetPage.saveBtn.click();
    await expect(MyTimesheetPage.saveBtn).toBeDisplayed();
    await expect(MyTimesheetPage.hourErrorLbl).toBeDisplayed();
  }).timeout(120000);

  it("TIME_TC05: Nhập giờ vượt quá 24h / ngày", async function () {
    if (!(await arrangeEditableTimesheet())) this.skip();

    await MyTimesheetPage.enterHours(0, "30");

    await expect(MyTimesheetPage.hourErrorLbl).toBeDisplayed();
    await expect(MyTimesheetPage.hourErrorLbl).toHaveText(
      expect.stringContaining("Less Than 24"),
    );

    await MyTimesheetPage.saveBtn.click();
    await expect(MyTimesheetPage.saveBtn).toBeDisplayed();
    await expect(MyTimesheetPage.hourErrorLbl).toBeDisplayed();
  }).timeout(120000);

  it("TIME_TC06: Nhập giờ định dạng HH:MM", async function () {
    if (!(await arrangeEmptyTimesheet())) this.skip();

    await MyTimesheetPage.editBtn.click();
    await MyTimesheetPage.selectProject("a");
    await MyTimesheetPage.selectActivity();
    await MyTimesheetPage.enterHours(0, "08:30");

    await expect(MyTimesheetPage.hourErrorLbl).not.toBeDisplayed();

    await MyTimesheetPage.saveTimesheet();

    const tableText = await MyTimesheetPage.timesheetTbl.getText();
    const totalCount = (tableText.match(/08:30/g) || []).length;
    expect(totalCount).toBeGreaterThanOrEqual(3);
  }).timeout(120000);

  it("TIME_TC07: Submit Timesheet chưa nhập giờ", async function () {
    if (!(await arrangeEmptyTimesheet())) this.skip();

    await MyTimesheetPage.submitTimesheet();

    await expect(MyTimesheetPage.statusLbl).toHaveText("Status: Submitted");
    await expect(MyTimesheetPage.submitBtn).not.toBeDisplayed();
  }).timeout(120000);

  it("TIME_TC08: Xem Timesheet của kỳ trước", async () => {
    await MyTimesheetPage.open("2020-01-06");
    await MyTimesheetPage.periodTxb.waitForDisplayed({ timeout: 10000 });

    expect(await MyTimesheetPage.periodTxb.getValue()).toContain("2020");

    await MyTimesheetPage.goToPreviousWeek();

    expect(await MyTimesheetPage.periodTxb.getValue()).toContain("2019");
  });

  it("TIME_TC13: Punch In (Attendance)", async () => {
    await PunchInOutPage.ensurePunchedOut();
    await PunchInOutPage.open();
    await PunchInOutPage.punchIn("Bắt đầu ca");

    await expect(PunchInOutPage.punchOutLbl).toBeDisplayed();
    expect(await browser.getUrl()).toContain("punchOut");
  });
});
