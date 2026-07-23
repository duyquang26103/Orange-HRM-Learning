export const config = {
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',

    // ==================
    // Specify Test Files
    // ==================
    // Controls which specs run by default with `pnpm run wdio`. Use `--spec <path>` to run
    // a different file without editing this array.
    specs: [
        // './test/specs/**/EmployeeList.js',
        './test/specs/**/PIM.js'
        //'./test/specs/**/Login.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],

    // ============
    // Capabilities
    // ============
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome',
        browserVersion: 'stable',
        'goog:chromeOptions': {
            args: process.env.CI
                ? ['--headless=new', '--no-sandbox', '--disable-gpu', '--window-size=1920,1080']
                : []
        }
    }],

    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,

    // If `url` starts with `/` the path is appended to baseUrl; a bare path like
    // 'auth/login' is appended directly, so page objects can call open('auth/login').
    baseUrl: 'https://opensource-demo.orangehrmlive.com/web/index.php/',

    // Default timeout for all waitFor* commands. Đặt cao hơn mức thông thường vì đây là demo
    // public dùng chung (opensource-demo.orangehrmlive.com), độ trễ phản hồi dao động mạnh.
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',
    reporters: ['spec', ['allure', { outputDir: 'allure-results' }]],

    mochaOpts: {
        ui: 'bdd',
        // PIM_TC17 tạo tuần tự 3 nhân viên trong 1 test (theo đúng luồng thủ công của test
        // case xóa hàng loạt) — trên demo public chậm, tổng thời gian có thể vượt 60s. Ngân
        // sách phải chừa margin phía trên worst-case đó để Mocha không cắt ngang khi test
        // đang chạy đúng, chỉ là chậm.
        timeout: 90000
    },

    // =====
    // Hooks
    // =====
    // Chỉ afterTest được dùng (chụp screenshot khi fail). Các hook khác của WDIO (onPrepare,
    // before, beforeTest, afterSuite, onComplete, ...) không cần cho project này nên không
    // khai báo — danh sách đầy đủ: https://webdriver.io/docs/configurationfile.
    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    }
}
