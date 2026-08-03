// BASE_URL đọc từ ENV (test/config/env.js đã nạp .env qua dotenv). Không hard-code URL ở đây.
import { BASE_URL } from './test/config/env.js';

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
    baseUrl: BASE_URL,

    // Default timeout for all waitFor* commands. Đặt cao hơn mức thông thường vì đây là demo
    // public dùng chung (opensource-demo.orangehrmlive.com), độ trễ phản hồi dao động mạnh.
    waitforTimeout: 15000,
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
        timeout: 120000,
        // opensource-demo.orangehrmlive.com là server public dùng chung, độ trễ dao động mạnh
        // (một lần chạy có thể chậm gấp đôi lần khác). Đây là smoke test E2E chạy thật trên đó,
        // nên thỉnh thoảng một bước bị timeout do MÔI TRƯỜNG chứ không phải lỗi code. Cho mỗi
        // test tối đa 3 lần thử (retry 2) để nhiễu môi trường không làm đỏ CI; test hỏng thật
        // vẫn fail cả 3 lần. Các test có tạo dữ liệu được viết idempotent để retry an toàn.
        retries: 2
    },

    // =====
    // Hooks
    // =====
    // Chỉ afterTest được dùng (chụp screenshot khi fail). Các hook khác của WDIO (onPrepare,
    // before, beforeTest, afterSuite, onComplete, ...) không cần cho project này nên không
    // khai báo — danh sách đầy đủ: https://webdriver.io/docs/configurationfile.
    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            // Chụp screenshot làm bằng chứng khi fail, nhưng bọc try/catch: khi demo public
            // treo (renderer không phản hồi) thì takeScreenshot cũng treo/né lỗi — không được
            // để hook này làm hỏng hoặc kéo dài vô hạn vòng chạy (đặc biệt khi có retry).
            try {
                await browser.takeScreenshot();
            } catch {
                // bỏ qua: mất screenshot không quan trọng bằng việc suite chạy tiếp
            }
        }
    }
}
