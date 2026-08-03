import LoginPage from '../../pageobjects/login-page/LoginPage.js';
import SideMenuComponent from '../../pageobjects/components/SideMenuComponent.js';
import EmployeeTabsComponent from '../../pageobjects/components/EmployeeTabsComponent.js';
import ContactDetailsPage from '../../pageobjects/myinfo-page/ContactDetailsPage.js';
import { dataInfo } from '../../data/myinfo.js';
import { credentials } from '../../data/credentials.js';

describe('OrangeHRM - My Info - Contact Details', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(credentials.admin.username, credentials.admin.password);
        await SideMenuComponent.goTo('My Info');
        await EmployeeTabsComponent.goToTab('Contact Details');
        await ContactDetailsPage.headerTitle.waitForDisplayed({ timeout: 5000 });
    });

    it('MYINFO_TC11: Update Contact Details', async () => {
        const testData = dataInfo.updateContact;
        await ContactDetailsPage.updateContact(testData.street,testData.city,testData.phone);
        await expect (ContactDetailsPage.successToast).toBeDisplayed();
        await expect(ContactDetailsPage.successToast).toHaveText( expect.stringContaining('Success'));
    });

    it ('MYINFO_TC12: Verify the number contains letters.', async () => {
        const testData = dataInfo.wrongContact;
        await ContactDetailsPage.mobileTbx.setValue(testData.phone);
        await expect (ContactDetailsPage.phoneErrorMsg).toBeDisplayed();
        await expect(ContactDetailsPage.phoneErrorMsg).toHaveText(testData.phoneError);
    });

    it ('MYINFO_TC13: Verify the email format is invalid.', async () => {
        const testData = dataInfo.wrongContact;
        await ContactDetailsPage.workEmailTbx.setValue(testData.email);
        await expect (ContactDetailsPage.emailErrorMsg).toBeDisplayed();
        await expect(ContactDetailsPage.emailErrorMsg).toHaveText(testData.emailError);
    });

    it('MYINFO_TC24: XSS payload in Street 1 is stored as plain text and not executed', async () => {
        await browser.refresh();
        await ContactDetailsPage.waitForFormLoaded();

        const address = dataInfo.xssAddress;
        await ContactDetailsPage.clearField(ContactDetailsPage.street1Tbx);
        await ContactDetailsPage.street1Tbx.setValue(address);
        await ContactDetailsPage.saveBtn.click();

        await expect(ContactDetailsPage.successToast).toBeDisplayed();

        let alertOpened = true;
        try {
            await browser.getAlertText();
        } catch {
            alertOpened = false;
        }
        expect(alertOpened).toBe(false);

        await browser.refresh();
        await ContactDetailsPage.waitForFormLoaded();
        await expect(ContactDetailsPage.street1Tbx).toHaveValue(address);
    });

})