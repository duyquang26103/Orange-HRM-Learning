class SideMenuComponent {
    get adminNav() {
        return $('a*=Admin');
    }
    get pimNav() {
        return $('a*=PIM');
    }
    get leaveNav() {
        return $('a*=Leave');
    }
    get recruitmentNav() {
        return $('a*=Recruitment');
    }
    get searchMenuTbx() {
        return $('input[placeholder="Search"]');
    }

    async goTo(moduleName) {
        await this.searchMenuTbx.setValue(moduleName);
        const menuItem = $(`a*=${moduleName}`);
        await menuItem.waitForDisplayed();
        await menuItem.click();
    }
}

export default new SideMenuComponent();
