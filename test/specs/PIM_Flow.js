import { addEmployeeFlow, employeeProfileFlow, employeeCleanupFlow, authFlow } from '../flows/Flows.js';
import PersonalDetailsPage from '../pageobjects/PersonalDetailsPage.js';
import ContactDetailsPage from '../pageobjects/ContactDetailsPage.js';
import EmployeeListPage from '../pageobjects/EmployeeListPage.js';

const runId = Date.now();
const employeeId = `F${String(runId).slice(-8)}`;
const firstName = 'FlowDemo';
const lastName = `User${String(runId).slice(-4)}`;

describe('PIM Module (Flow Model)', () => {
    before(async () => {
        await authFlow.loginAsAdmin();
    });

    it('FLOW_TC01: Tạo nhân viên mới qua AddEmployeeFlow', async () => {
        await addEmployeeFlow.createEmployee({ firstName, lastName, employeeId });

        await expect(PersonalDetailsPage.employeeFullName).toHaveText(`${firstName} ${lastName}`, { containing: true });
    });

    it('FLOW_TC02: Chỉnh sửa Personal + Contact Details qua EmployeeProfileFlow', async () => {
        await employeeProfileFlow.openAndEditPersonalDetails(employeeId, {
            nationality: 'Vietnamese',
            maritalStatus: 'Single'
        });
        await expect(PersonalDetailsPage.toast).toHaveText('Successfully', { containing: true });

        await employeeProfileFlow.editContactDetails({ address: '123 Flow St', mobile: '0900000000' });
        await expect(ContactDetailsPage.toast).toHaveText('Successfully', { containing: true });
    });

    it('FLOW_TC03: Xóa nhân viên qua EmployeeCleanupFlow', async () => {
        await employeeCleanupFlow.deleteById(employeeId);

        await expect(EmployeeListPage.toastMessage).toHaveText('Successfully', { containing: true });
    });
});
