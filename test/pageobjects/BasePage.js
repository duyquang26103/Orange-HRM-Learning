export default class Page {
    open(path) {
        return browser.url(path);
    }

    async clearField(el) {
        await browser.waitUntil(
            async () => {
                const currentValue = await el.getValue();
                if (currentValue === '') return true;

                await el.click();
                await browser.keys(['End']);
                for (let i = 0; i < currentValue.length; i++) {
                    await browser.keys(['Backspace']);
                }
                return (await el.getValue()) === '';
            },
            { timeoutMsg: 'Field did not clear in time' }
        );
    }
}
