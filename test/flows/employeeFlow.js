import SideMenuComponent from '../pageobjects/components/SideMenuComponent.js';
import AddEmployeePage from '../pageobjects/AddEmployeePage.js';

class EmployeeFlow {
    // Hàm thực hiện trọn vẹn luồng thêm mới nhân viên
    async createNewEmployee(firstName, middleName, lastName, empId) {
        // Bước 1: Mở phân hệ PIM -> Chọn Add Employee
        await SideMenuComponent.goTo('PIM');
        await $('//a[text()="Add Employee"]').click();

        // Bước 2: Điền đầy đủ thông tin nhân viên và lưu
        await AddEmployeePage.createFullEmployee(firstName, middleName, lastName, empId);

        // Bước 3: Đợi chuyển trang thành công
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('viewPersonalDetails')
        );
    }
}

export default new EmployeeFlow();