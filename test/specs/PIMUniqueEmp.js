import LoginPage from '../pageobjects/LoginPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';
import AddEmployeePage from '../pageobjects/AddEmployeePage.js';
import PersonalDetailsPage from '../pageobjects/PersonalDetailsPage.js';
import { EmployUniq } from '../utils/EmployUniq.js';


const VALID_USER = 'Admin';
const VALID_PASSWORD = 'admin123';

describe('PIM Unique Employee Test', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(VALID_USER, VALID_PASSWORD);
        await DashboardPage.dashboardTag.waitForDisplayed({ timeout: 3000 });

    });

    it('TC_01: Tạo nhân viên với tên và Employee Id duy nhất mỗi lần chạy', async () => {
        const employee = EmployUniq('QA');
        await AddEmployeePage.open();
        await AddEmployeePage.fillName({ firstName: employee.firstName, lastName: employee.lastName });
        await AddEmployeePage.setEmployeeId(employee.employeeId);
        await AddEmployeePage.save();

        await PersonalDetailsPage.employeeFullName.waitForDisplayed({ timeout: 30000 });
        await expect(PersonalDetailsPage.employeeFullName).toHaveText(
            `${employee.firstName} ${employee.lastName}`,
            { containing: true }
        );
        await expect(PersonalDetailsPage.employeeIdInput).toHaveValue(employee.employeeId);
    });
});
