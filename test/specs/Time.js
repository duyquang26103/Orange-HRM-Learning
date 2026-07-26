import DashboardPage from "../pageobjects/DashboardPage.js";
import LoginPage from "../pageobjects/LoginPage.js";
import PunchInOutPage from "../pageobjects/PunchInOutPage.js";
import MyTimesheetPage from "../pageobjects/MyTimesheetPage.js";

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
  it("TIME_TC13: Punch In (Attendance)", async () => {
    await PunchInOutPage.ensurePunchedOut(); // ARRANGE: tự dọn tiền đề
    await PunchInOutPage.open();
    await PunchInOutPage.punchIn("Bắt đầu ca");

    await expect(PunchInOutPage.punchOutLbl).toBeDisplayed();
    expect(await browser.getUrl()).toContain("punchOut");
  });
});
