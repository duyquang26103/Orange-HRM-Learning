class EmployeeTabsComponent {
    getTabLink(tabName) {
        return $(`a*=${tabName}`);
    }

    async goToTab(tabName) {
        const tab = this.getTabLink(tabName);
        await tab.waitForClickable({ timeout: 5000 });
        await tab.click();
    }
}

export default new EmployeeTabsComponent();
