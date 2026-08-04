import Page from "./BasePage.js";

class PunchInOutPage extends Page {
  open() {
    return super.open("attendance/punchIn");
  }

  get noteTxa() {
    return $("//textarea");
  }
  get punchBtn() {
    return $('button[type="submit"]');
  }
  get punchOutLbl() {
    return $('//h6[text()="Punch Out"]');
  }

  get punchInLbl() {
    return $('//h6[text()="Punch In"]');
  }

  async waitForPunchScreen() {
    await browser.waitUntil(
      async () =>
        (await this.punchInLbl.isDisplayed()) ||
        (await this.punchOutLbl.isDisplayed()),
      { timeout: 20000, timeoutMsg: "Man hinh punch khong render" },
    );
  }

  async ensurePunchedOut() {
    await super.open("attendance/punchIn");
    await this.waitForPunchScreen();
    if (await this.punchOutLbl.isDisplayed()) {
      await this.punchBtn.click();
      await this.punchInLbl.waitForDisplayed({ timeout: 20000 });
    }
  }

  async punchIn(note) {
    if (note) await this.noteTxa.setValue(note);
    await this.punchBtn.click();
  }

  async punchOut(note) {
    if (note) await this.noteTxa.setValue(note);
    await this.punchBtn.click();
  }

  async ensurePunchedIn() {
    await super.open("attendance/punchIn");
    await this.waitForPunchScreen();
    if (await this.punchInLbl.isDisplayed()) {
      await this.punchBtn.click();
      await this.punchOutLbl.waitForDisplayed({ timeout: 20000 });
    }
  }
}

export default new PunchInOutPage();
