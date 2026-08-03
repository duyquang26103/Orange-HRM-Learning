import LoginPage from '../pageobjects/LoginPage.js';
import EmployeeListPage from '../pageobjects/EmployeeListPage.js';
import { ADMIN } from '../config/env.js';

describe('Employee List', () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login(ADMIN.username, ADMIN.password);
  })

  it('TC01: Search employee by name', async () => {
    await EmployeeListPage.open();
    await EmployeeListPage.searchEmployeeByName('John Doe');

    await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(1)
  })
})

