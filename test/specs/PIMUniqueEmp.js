import LoginPage from '../pageobjects/LoginPage.js';
import DashboardPage from '../pageobjects/DashboardPage.js';
import AddEmployeePage from '../pageobjects/AddEmployeePage.js';
import PersonalDetailsPage from '../pageobjects/PersonalDetailsPage.js';
import { uniqueEmployee } from '../utils/EmployUniq.js';
import { ADMIN } from '../config/env.js';

describe('PIM Unique Employee Test', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(ADMIN.username, ADMIN.password);
        await DashboardPage.dashboardTag.waitForDisplayed({ timeout: 3000 });

    });

    it('TC_01: Tạo nhân viên với tên và Employee Id duy nhất mỗi lần chạy', async () => {
        const employee = uniqueEmployee('QA');
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
