import LoginPage from '../../pageobjects/login-page/LoginPage.js';
import ApplyLeavePage from '../../pageobjects/leave-page/ApplyLeavePage.js';
import { credentials } from '../../data/credentials.js';

describe('LEAVE MODULE: Apply Leave', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(credentials.admin.username, credentials.admin.password);
    });

    it('LEAVE_TC01: Apply Leave with valid values', async () => {
        await ApplyLeavePage.open();
        await ApplyLeavePage.applyLeave('CAN - Vacation', '2024-07-21', '2024-07-24', 'Vacation');
    });

    it('LEAVE_TC02: Apply Leave with Leave Type left blank', async () => {
        await ApplyLeavePage.open();
        await ApplyLeavePage.applyLeave('', '2024-07-21', '2024-07-24', 'Vacation');
    });

    it('LEAVE_TC03: Apply Leave with From Date left blank', async () => {
        await ApplyLeavePage.open();
        await ApplyLeavePage.applyLeave('CAN - Vacation', '', '2024-07-24', 'Vacation');
    });

    it('LEAVE_TC04: Apply Leave with To Date less than From Date', async () => {
        await ApplyLeavePage.open();
        await ApplyLeavePage.applyLeave('CAN - Vacation', '2024-07-24', '2024-07-21', 'Vacation');
    });
});
