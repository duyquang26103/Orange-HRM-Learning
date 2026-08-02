import Page from "./BasePage.js";

class ProjectsPage extends Page {
  open() {
    return super.open("time/viewProjects");
  }

  get addBtn() {
    return $('//button[normalize-space()="Add"]');
  }
  get nameTxb() {
    return $('//label[text()="Name"]/../..//input');
  }
  get customerTxb() {
    return $('//label[text()="Customer Name"]/../..//input');
  }
  get firstOpt() {
    return $('(//div[@role="option"])[1]');
  }
  get saveBtn() {
    return $('//button[normalize-space()="Save"]');
  }
  get requiredLbl() {
    return $(".oxd-input-field-error-message");
  }
  get tableBody() {
    return $(".oxd-table-body");
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

  async addProject(name, customerName) {
    await this.addBtn.click();
    await this.nameTxb.waitForDisplayed({ timeout: 10000 });
    await this.nameTxb.setValue(name);
    for (let i = 1; i <= 3; i++) {
      await this.customerTxb.setValue(customerName);
      try {
        await this.waitForRealOption();
        break;
      } catch (err) {
        if (i === 3) throw err;
        console.log(`customer autocomplete retry ${i + 1}...`);
      }
    }
    await this.firstOpt.click();
    await this.saveBtn.click();
    await this.successToast.waitForDisplayed({ timeout: 15000 });
    await this.open();
    await this.waitForProjectList();
  }

  async waitForProjectList() {
    await this.tableBody.waitForDisplayed({ timeout: 15000 });
    await browser.waitUntil(
      async () => (await this.tableBody.getText()).length > 0,
      { timeout: 30000, timeoutMsg: "Danh sach project khong tai xong" },
    );
  }
  get successToast() {
    return $(".oxd-toast");
  }
}

export default new ProjectsPage();
