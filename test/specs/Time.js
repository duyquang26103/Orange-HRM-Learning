import DashboardPage from "../pageobjects/DashboardPage.js";
import LoginPage from "../pageobjects/LoginPage.js";
import PunchInOutPage from "../pageobjects/PunchInOutPage.js";

describe("Time Module", () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login("Admin", "admin123");
    await DashboardPage.dashboardTag.waitForDisplayed({ timeout: 10000 }); // chờ login THẬT SỰ xong
  });

  // các it() nằm ở đây
  it("TIME_TC13: Punch In (Attendance)", async () => {
    // --- ACT ---
    await PunchInOutPage.ensurePunchedOut(); // ARRANGE: tự dọn tiền đề
    await PunchInOutPage.open();
    await PunchInOutPage.punchIn("Bắt đầu ca");

    // --- ASSERT (m tự viết 2 dòng này) ---
    // dòng 1: tiêu đề "Punch Out" phải hiển thị
    //   → dùng locator punchOutLbl vừa thêm + toBeDisplayed
    //   → xem mẫu: dòng assert đầu tiên trong LOGIN_TC01 (file Login.js)
    // dòng 2: URL phải chứa 'punchOut'
    //   → xem mẫu: dòng cuối LOGIN_TC15 (file Login.js) — copy về sửa chữ trong ngoặc
    // --- ASSERT ---
    await expect(PunchInOutPage.punchOutLbl).toBeDisplayed();
    expect(await browser.getUrl()).toContain("punchOut");
  });
});
