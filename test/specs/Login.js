import LoginPage from '../pageobjects/LoginPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';
import ForgotPasswordPage from '../pageobjects/ForgotPasswordPage.js';
import { validUser, invalidLoginCases } from '../data/Login.js';

const VALID_USER = validUser.username;
const VALID_PASS = validUser.password;
const INVALID_CREDENTIALS = 'Invalid credentials';

describe('Login Module', () => {
    beforeEach(async () => {
        await browser.url('auth/logout');
        await LoginPage.inputUsername.waitForDisplayed({ timeout: 10000 });
    });

    // LOGIN_TC01 | Severity: S | Priority: Critical | Happy path
    it('LOGIN_TC01: đăng nhập thành công với tài khoản hợp lệ', async () => {
        await LoginPage.login(VALID_USER, VALID_PASS);
        // Expected: chuyển đến Dashboard, hiển thị breadcrumb "Dashboard"
        await expect(DashboardPage.dashboardTag).toBeDisplayed();
    });

    // LOGIN_TC02, TC03, TC09, TC10, TC19, TC20 | Bảo mật cơ bản / không tiết lộ username tồn tại /
    // password case-sensitive / SQL injection / boundary độ dài / Unicode
    // Data-Driven: các case này cùng hành động (login) + cùng assertion (errorAlert hiển thị
    // + text "Invalid credentials"), chỉ khác dữ liệu đầu vào -> gộp bằng forEach thay vì lặp
    // lại thân test cho từng case. Dữ liệu khai báo tập trung ở test/data/Login.js.
    invalidLoginCases.forEach(({ tcId, description, username, password, waitTimeout }) => {
        it(`${tcId}: ${description}`, async () => {
            await LoginPage.login(username, password);

            await LoginPage.errorAlert.waitForDisplayed({ timeout: waitTimeout ?? 5000 });
            await expect(LoginPage.errorAlert).toHaveText(INVALID_CREDENTIALS);
        });
    });

    // LOGIN_TC04 | Severity: A | Priority: High | Validation client-side
    it('LOGIN_TC04: bỏ trống username', async () => {
        await LoginPage.setPassword(VALID_PASS);
        await LoginPage.clickLogin();

        await expect(LoginPage.requiredErrors).toBeElementsArrayOfSize(1);
    });

    // LOGIN_TC05 | Severity: A | Priority: High | Validation client-side
    it('LOGIN_TC05: bỏ trống password', async () => {
        await LoginPage.setUsername(VALID_USER);
        await LoginPage.clickLogin();

        await expect(LoginPage.requiredErrors).toBeElementsArrayOfSize(1);
    });

    // LOGIN_TC06 | Severity: A | Priority: High | Validation đồng thời nhiều trường
    it('LOGIN_TC06: bỏ trống cả username và password', async () => {
        await LoginPage.clickLogin();

        await expect(LoginPage.requiredErrors).toBeElementsArrayOfSize(2);
    });

    // LOGIN_TC07 | Severity: B | Priority: Medium
    it.skip('LOGIN_TC07: username phân biệt hoa thường', async () => {
        // TODO: xác nhận hành vi thực tế với user trước khi assert cứng (xem cột Note trong Excel)
        await LoginPage.login('admin', VALID_PASS);
    });

    // LOGIN_TC08 | Severity: C | Priority: Medium
    it.skip('LOGIN_TC08: khoảng trắng thừa trong username', async () => {
        // TODO: xác nhận hành vi trim với user trước khi assert (xem cột Note trong Excel)
        await LoginPage.login(' Admin ', VALID_PASS);
    });

    // LOGIN_TC11 | Severity: S | Priority: High | Bảo mật XSS
    it('LOGIN_TC11: XSS trong ô username', async () => {
        await LoginPage.login('<script>alert(1)</script>', 'abc');

        expect(await browser.getUrl()).toContain('auth/login');
        await expect(LoginPage.btnSubmit).toBeDisplayed();
    });

    // LOGIN_TC12 | Severity: B | Priority: Medium | Kiểm tra điều hướng
    it('LOGIN_TC12: Forgot Password — điều hướng', async () => {
        await LoginPage.clickForgotPassword();

        await expect(ForgotPasswordPage.inputUsername).toBeDisplayed();
        expect(await browser.getUrl()).toContain('requestPasswordResetCode');
    });

    // LOGIN_TC13 | Severity: B | Priority: Medium | Luồng quên mật khẩu
    // ⚠️ UNSTABLE trên site demo: bước submit "Reset Password" bị treo (verified qua test + debug
    // spec + wdio-mcp đều timeout ngay tại click Reset — nghi rate-limit/redirect chậm phía demo).
    it.skip('LOGIN_TC13: reset password với username hợp lệ', async () => {
        // TODO: bật lại khi chạy trên môi trường thật (không phải public demo). Bước xác nhận:
        // await LoginPage.clickForgotPassword();
        // await ForgotPasswordPage.resetPassword(VALID_USER);
        // await expect(ForgotPasswordPage.successMessage).toBeDisplayed();
    });

    // LOGIN_TC14 | Severity: C | Priority: Low | Kiểm tra nút Cancel
    it('LOGIN_TC14: reset password — click Cancel', async () => {
        await LoginPage.clickForgotPassword();
        await ForgotPasswordPage.cancel();

        await expect(LoginPage.btnSubmit).toBeDisplayed();
        expect(await browser.getUrl()).toContain('auth/login');
    });

    // LOGIN_TC15 | Severity: S | Priority: Critical | Luồng logout cơ bản
    it('LOGIN_TC15: đăng xuất (Logout)', async () => {
        await LoginPage.login(VALID_USER, VALID_PASS);
        await expect(DashboardPage.dashboardTag).toBeDisplayed();
        await DashboardPage.logout();

        await expect(LoginPage.btnSubmit).toBeDisplayed();
        expect(await browser.getUrl()).toContain('auth/login');
    });

    // LOGIN_TC16 | Severity: S | Priority: Critical | Bảo vệ route
    it('LOGIN_TC16: truy cập trang nội bộ khi chưa login', async () => {
        await DashboardPage.open();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('auth/login'),
            { timeout: 10000, timeoutMsg: 'Không bị redirect về login khi chưa đăng nhập' }
        );
        await expect(LoginPage.btnSubmit).toBeDisplayed();
    });

    // LOGIN_TC17 | Severity: A | Priority: High
    // ⚠️ FLAKY: phụ thuộc browser history/back-button + bfcache -> không ổn định để automate
    it.skip('LOGIN_TC17: session sau khi logout (nút Back)', async () => {
        // TODO: cân nhắc test ở tầng khác (kiểm tra cookie/token bị hủy) thay vì back-button
    });

    // LOGIN_TC18 | Severity: B | Priority: Medium | Session persistence
    it('LOGIN_TC18: nhớ trạng thái đăng nhập khi refresh', async () => {
        await LoginPage.login(VALID_USER, VALID_PASS);
        await expect(DashboardPage.dashboardTag).toBeDisplayed();
        await browser.refresh();
        await expect(DashboardPage.dashboardTag).toBeDisplayed();
    });
});
