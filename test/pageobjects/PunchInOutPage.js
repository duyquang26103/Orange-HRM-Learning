import Page from "./BasePage.js";

class PunchInOutPage extends Page {
  // 1. extend BasePage để có open(path)
  open() {
    return super.open("attendance/punchIn"); // 2. đường dẫn màn hình (nối baseUrl)
  }

  // ===== Locators: get + tên theo suffix =====
  get noteTxa() {
    return $("//textarea");
  }
  get punchBtn() {
    return $('button[type="submit"]');
  }
  get punchOutLbl() {
    return $('//h6[text()="Punch Out"]');
  }
  // locator mới: tiêu đề "Punch In" (đối xứng với punchOutLbl có sẵn)
  get punchInLbl() {
    return $('//h6[text()="Punch In"]');
  }
  // ===== Actions: gom CHUỖI thao tác có nghĩa =====
  // Action dọn trạng thái: đảm bảo đang punched-out trước khi test punch in
  async ensurePunchedOut() {
    await super.open("attendance/punchIn");
    if (await this.punchOutLbl.isDisplayed()) {
      // bị redirect sang punchOut = đang in
      await this.punchBtn.click(); // → bấm Out để trả về trạng thái sạch
      await this.punchInLbl.waitForDisplayed({ timeout: 10000 });
    }
  }
  async punchIn(note) {
    if (note) await this.noteTxa.setValue(note);
    await this.punchBtn.click();
  }
}

export default new PunchInOutPage(); // 3. export SINGLETON (đã new sẵn)
