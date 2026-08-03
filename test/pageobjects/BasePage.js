export default class Page {
    open(path) {
        return browser.url(path)
    }

    // Chờ mọi overlay loader của OrangeHRM biến mất trước khi thao tác.
    // `.oxd-form-loader` phủ lên form (Add Employee...), `.oxd-table-loader` phủ lên bảng
    // danh sách. Nếu click/setValue khi loader còn hiển thị, Chrome báo
    // "element click intercepted" -> test flaky. Element đã bị gỡ khỏi DOM coi như hết loader.
    async waitForLoadersGone(timeout = 30000) {
        await browser.waitUntil(async () => {
            const loaders = await $$('.oxd-form-loader, .oxd-table-loader');
            for (const loader of loaders) {
                try {
                    if (await loader.isDisplayed()) return false;
                } catch {
                    // element không còn trong DOM -> coi như loader đã biến mất
                }
            }
            return true;
        }, { timeout, timeoutMsg: 'Loader overlay của OrangeHRM không biến mất sau khi chờ' });
    }
}
