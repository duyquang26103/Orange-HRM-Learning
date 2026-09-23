import LoginPage from '../../pageobjects/login-page/LoginPage.js';
import EmployeeListPage from '../../pageobjects/pim-page/EmployeeListPage.js';
import { credentials } from '../../data/credentials.js';

const searchTarget = { name: 'John Doe' };

describe('Employee List', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(credentials.admin.username, credentials.admin.password);
    });

    it('TC01: Search employee by name', async () => {
        await EmployeeListPage.open();
        await EmployeeListPage.searchEmployeeByName(searchTarget.name);

        await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(1);
    });
});
