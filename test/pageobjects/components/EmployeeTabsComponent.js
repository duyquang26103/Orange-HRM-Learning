class EmployeeTabsComponent {
    getTabLink(tabName) {
        return $(`a*=${tabName}`);
    }

    async goToTab(tabName) {
        const tab = this.getTabLink(tabName);
        await tab.waitForClickable();
        await tab.click();
    }
}

export default new EmployeeTabsComponent();
