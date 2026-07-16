import LoginPage from '../pageobjects/LoginPage.js';
import EmployeeListPage from '../pageobjects/EmployeeListPage.js';

describe('Employee List', () => {
  before(async () => {
    await LoginPage.open();
    const adminUser = {
      username: 'Admin',
      password: 'admin123'
    };
    await LoginPage.login(adminUser.username, adminUser.password);
  })

  it('TC01: Search employee by name', async () => {
    await EmployeeListPage.open();
    await EmployeeListPage.searchEmployeeByName('John Doe');

    await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(1)
  })
})

