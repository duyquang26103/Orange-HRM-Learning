import Page from "./BasePage.js";

class CustomersPage extends Page {
  open() {
    return super.open("time/viewCustomers");
  }

  get addBtn() {
    return $('//button[normalize-space()="Add"]');
  }
  get nameTxb() {
    return $('//label[text()="Name"]/../..//input');
  }
  get saveBtn() {
    return $('//button[normalize-space()="Save"]');
  }
  get tableBody() {
    return $(".oxd-table-body");
  }

  async addCustomer(name) {
    await this.addBtn.click();
    await this.nameTxb.waitForDisplayed({ timeout: 20000 });
    await this.nameTxb.setValue(name);
    await this.saveBtn.click();
    await this.addBtn.waitForDisplayed({ timeout: 20000 });
  }
}

export default new CustomersPage();
