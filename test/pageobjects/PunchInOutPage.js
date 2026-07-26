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

  async ensurePunchedOut() {
    await super.open("attendance/punchIn");
    if (await this.punchOutLbl.isDisplayed()) {
      await this.punchBtn.click();
      await this.punchInLbl.waitForDisplayed({ timeout: 10000 });
    }
  }
  async punchIn(note) {
    if (note) await this.noteTxa.setValue(note);
    await this.punchBtn.click();
  }
}

export default new PunchInOutPage();
