import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/LoginPage.js';
import EmployeeListPage from '../pageobjects/EmployeeListPage.js';
import AddEmployeePage from '../pageobjects/AddEmployeePage.js';
// 1. Chỉ cần Import Flow vào
import employeeFlow from '../flows/employeeFlow.js';

describe('Employee List', () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login('Admin', 'admin123');
  })

  it('TC01: Search employee by name', async () => {
    await EmployeeListPage.open();
    await EmployeeListPage.searchEmployeeByName('John Doe');

    await expect(EmployeeListPage.employeeRows).toBeElementsArrayOfSize(1)
  })
  it.only('Tạo nhân viên mới thành công bằng Flow Pattern', async () => {
    const empId = `EMP_${Math.floor(Math.random() * 1000)}`;

    // 2. GỌI DUY NHẤT 1 DÒNG FLOW NGHIỆP VỤ
    await employeeFlow.createNewEmployee('Nguyen', 'Van', 'An', empId);

    // 3. XÁC THỰC KẾT QUẢ (Assert)
    await expect(AddEmployeePage.employeeProfileHeader).toHaveText('Nguyen An');
    await expect(AddEmployeePage.employeeIdTbx).toHaveValue(empId);
  });


})

