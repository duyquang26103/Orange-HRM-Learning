export default class Page {
    open(path) {
        return browser.url(path);
    }

    async clearField(el) {
        const currentValue = await el.getValue();
        await el.click();
        await browser.keys(['End']);
        for (let i = 0; i < currentValue.length; i++) {
            await browser.keys(['Backspace']);
        }
    }
}
