import Page from '../BasePage.js';

class ApplyLeavePage extends Page {
    open() {
        return super.open('leave/applyLeave');
    }

    get applyTab() {
        return $('a*=Apply');
    }

    get leaveTypeDdn() {
        return $("//label[text()='Leave Type']/../following-sibling::div");
    }

    get fromDateTbx() {
        return $("//label[text()='From Date']/../following-sibling::div//input");
    }

    get toDateTbx() {
        return $("//label[text()='To Date']/../following-sibling::div//input");
    }

    get commentTxa() {
        return $("//label[text()='Comment']/../following-sibling::div//textarea");
    }

    get submitBtn() {
        return $("//button[@type='submit']");
    }

    async selectLeaveType(leaveType) {
        await this.leaveTypeDdn.click();
        await $(
            `//label[text()='Leave Type']/../following-sibling::div//div[text()='${leaveType}']`
        ).click();
    }

    async applyLeave(leaveType, fromDate, toDate, comment) {
        await this.selectLeaveType(leaveType);
        await this.fromDateTbx.setValue(fromDate);
        await this.toDateTbx.setValue(toDate);
        await this.commentTxa.setValue(comment);
        await this.submitBtn.click();
    }
}

export default new ApplyLeavePage();
