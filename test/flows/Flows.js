import LoginPage from '../pageobjects/LoginPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';
import ForgotPasswordPage from '../pageobjects/ForgotPasswordPage.js';
import AddEmployeePage from '../pageobjects/AddEmployeePage.js';
import PersonalDetailsPage from '../pageobjects/PersonalDetailsPage.js';
import ContactDetailsPage from '../pageobjects/ContactDetailsPage.js';
import EmployeeListPage from '../pageobjects/EmployeeListPage.js';

const DEFAULT_ADMIN = { username: 'Admin', password: 'admin123' };

// Timeout dùng chung, đặt tên rõ nghĩa thay vì số magic rải rác — đây cũng là nơi duy nhất
// cần sửa khi cần tinh chỉnh độ trễ cho một loại chờ cụ thể.
const DASHBOARD_TIMEOUT = 20000;
const CREATE_EMPLOYEE_TIMEOUT = 30000;
const FORGOT_PASSWORD_TIMEOUT = 10000;
const URL_WAIT_TIMEOUT = 30000;
const ROWS_WAIT_TIMEOUT = 30000;

async function waitForUrlToContain(fragment, timeout = URL_WAIT_TIMEOUT) {
    await browser.waitUntil(
        async () => (await browser.getUrl()).includes(fragment),
        { timeout, timeoutMsg: `URL không chứa "${fragment}" sau khi chờ` }
    );
}

async function waitForEmployeeRows(minCount = 1, timeout = ROWS_WAIT_TIMEOUT) {
    await browser.waitUntil(
        async () => (await EmployeeListPage.employeeRows).length >= minCount,
        { timeout, timeoutMsg: `Không tìm thấy đủ ${minCount} dòng nhân viên sau khi chờ` }
    );
}

/**
 * Flow (6): đăng nhập -> Dashboard -> đăng xuất. Gói logic mà mọi spec hiện đang lặp lại
 * riêng lẻ trong before()/beforeEach().
 */
export class AuthFlow {
    /**
     * @param {string} [username]
     * @param {string} [password]
     */
    async login(username = DEFAULT_ADMIN.username, password = DEFAULT_ADMIN.password) {
        await LoginPage.open();
        await LoginPage.login(username, password);
        await DashboardPage.dashboardTag.waitForDisplayed({ timeout: DASHBOARD_TIMEOUT });
    }

    async loginAsAdmin() {
        await this.login(DEFAULT_ADMIN.username, DEFAULT_ADMIN.password);
    }

    async logout() {
        await DashboardPage.logout();
        await waitForUrlToContain('auth/login');
    }

    /**
     * @param {string} [username]
     * @param {string} [password]
     */
    async loginThenLogout(username, password) {
        await this.login(username, password);
        await this.logout();
    }
}

/**
 * Flow (1) + (2) + (8): tạo mới nhân viên qua form Add Employee — có/không kèm login
 * details, đơn lẻ hoặc hàng loạt.
 */
export class AddEmployeeFlow {
    /**
     * Điền form + save + chờ redirect sang PersonalDetailsPage (happy path).
     * @param {{firstName?: string, middleName?: string, lastName?: string, employeeId?: string}} employee
     */
    async createEmployee({ firstName, middleName, lastName, employeeId } = {}) {
        await this.attemptCreateEmployee({ firstName, middleName, lastName, employeeId });
        await PersonalDetailsPage.employeeFullName.waitForDisplayed({ timeout: CREATE_EMPLOYEE_TIMEOUT });
    }

    /**
     * Như createEmployee, kèm bật "Create Login Details" và điền username/password.
     * @param {{firstName?: string, middleName?: string, lastName?: string, username: string, password: string}} employee
     */
    async createEmployeeWithLogin({ firstName, middleName, lastName, username, password }) {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName, middleName, lastName });
        await AddEmployeePage.enableCreateLoginDetails();
        await AddEmployeePage.fillLoginDetails({ username, password });
        await AddEmployeePage.save();
        await PersonalDetailsPage.employeeFullName.waitForDisplayed({ timeout: CREATE_EMPLOYEE_TIMEOUT });
    }

    /**
     * Điền form + save nhưng KHÔNG chờ redirect — dùng cho case cần assert lỗi validation
     * ngay trên form addEmployee (thiếu field bắt buộc, trùng Employee Id, ...).
     * @param {{firstName?: string, middleName?: string, lastName?: string, employeeId?: string}} employee
     */
    async attemptCreateEmployee({ firstName, middleName, lastName, employeeId } = {}) {
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName, middleName, lastName });
        if (employeeId) await AddEmployeePage.setEmployeeId(employeeId);
        await AddEmployeePage.save();
    }

    /**
     * Tạo nhiều nhân viên liên tiếp — dùng cho test data setup (vd. chuẩn bị data bulk delete).
     * @param {Array<{firstName?: string, middleName?: string, lastName?: string, employeeId?: string}>} employees
     */
    async createMany(employees) {
        for (const employee of employees) {
            await this.createEmployee(employee);
        }
    }
}

/**
 * Flow (3) + (4): tìm & mở hồ sơ nhân viên từ EmployeeListPage, rồi chỉnh Personal Details
 * và/hoặc Contact Details.
 */
export class EmployeeProfileFlow {
    /** @param {string} name */
    async openByName(name) {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName(name);
        await waitForEmployeeRows(1);
        await EmployeeListPage.openFirstRecord();
    }

    /** @param {string} id */
    async openById(id) {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(id);
        await waitForEmployeeRows(1);
        await EmployeeListPage.openFirstRecord();
    }

    /**
     * Giả định đang đứng trên PersonalDetailsPage (sau openByName/openById).
     * @param {{nationality?: string, maritalStatus?: string}} details
     */
    async editPersonalDetails({ nationality, maritalStatus } = {}) {
        if (nationality) await PersonalDetailsPage.setNationality(nationality);
        if (maritalStatus) await PersonalDetailsPage.setMaritalStatus(maritalStatus);
        await PersonalDetailsPage.save();
    }

    /**
     * Giả định đang đứng trên PersonalDetailsPage; tự chuyển sang tab Contact Details trước khi điền.
     * @param {{address?: string, mobile?: string}} details
     */
    async editContactDetails({ address, mobile } = {}) {
        await PersonalDetailsPage.openContactDetailsTab();
        if (address) await ContactDetailsPage.setAddress(address);
        if (mobile) await ContactDetailsPage.setMobile(mobile);
        await ContactDetailsPage.save();
    }

    /**
     * Composite: mở nhân viên theo Id rồi chỉnh Personal Details trong 1 lần gọi.
     * @param {string} id
     * @param {{nationality?: string, maritalStatus?: string}} details
     */
    async openAndEditPersonalDetails(id, details) {
        await this.openById(id);
        await this.editPersonalDetails(details);
    }

    /**
     * Composite: mở nhân viên theo Id rồi chỉnh Contact Details trong 1 lần gọi.
     * @param {string} id
     * @param {{address?: string, mobile?: string}} details
     */
    async openAndEditContactDetails(id, details) {
        await this.openById(id);
        await this.editContactDetails(details);
    }
}

/**
 * Flow (5): tìm & xóa nhân viên (đơn lẻ hoặc hàng loạt) từ EmployeeListPage.
 */
export class EmployeeCleanupFlow {
    /** @param {string} name */
    async deleteByName(name) {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName(name);
        await waitForEmployeeRows(1);
        await EmployeeListPage.deleteFirstRecord();
    }

    /** @param {string} id */
    async deleteById(id) {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(id);
        await waitForEmployeeRows(1);
        await EmployeeListPage.deleteFirstRecord();
    }

    /** @param {string} id */
    async cancelDeleteById(id) {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeById(id);
        await waitForEmployeeRows(1);
        await EmployeeListPage.cancelDeleteFirstRecord();
    }

    /**
     * Search theo tên (thường là prefix chung của nhóm nhân viên cần dọn), chọn `count`
     * dòng đầu rồi xóa hàng loạt.
     * @param {string} namePrefix
     * @param {number} count
     */
    async bulkDeleteByName(namePrefix, count) {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName(namePrefix);
        await waitForEmployeeRows(count);
        await EmployeeListPage.selectRows(count);
        await EmployeeListPage.deleteSelectedRecords();
    }
}

/**
 * Flow (7): từ trang Login mở "Forgot Password" rồi request reset hoặc cancel.
 */
export class ForgotPasswordFlow {
    async openFromLogin() {
        await LoginPage.clickForgotPassword();
        await ForgotPasswordPage.inputUsername.waitForDisplayed({ timeout: FORGOT_PASSWORD_TIMEOUT });
    }

    /** @param {string} username */
    async requestReset(username) {
        await this.openFromLogin();
        await ForgotPasswordPage.resetPassword(username);
    }

    async cancelFromLogin() {
        await this.openFromLogin();
        await ForgotPasswordPage.cancel();
    }
}

export const authFlow = new AuthFlow();
export const addEmployeeFlow = new AddEmployeeFlow();
export const employeeProfileFlow = new EmployeeProfileFlow();
export const employeeCleanupFlow = new EmployeeCleanupFlow();
export const forgotPasswordFlow = new ForgotPasswordFlow();
