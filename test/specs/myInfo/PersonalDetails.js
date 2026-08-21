import LoginPage from '../../pageobjects/login-page/LoginPage.js';
import SideMenuComponent from '../../pageobjects/components/SideMenuComponent.js';
import PersonalDetailsPage from '../../pageobjects/myinfo-page/PersonalDetailsPage.js';
import { dataInfo } from '../../data/myinfo.js';
import { credentials } from '../../data/credentials.js';

describe('OrangeHRM - My Info - Personal Details', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(credentials.admin.username, credentials.admin.password);
        await SideMenuComponent.goTo('My Info');
        await PersonalDetailsPage.headerTitle.waitForDisplayed();

        const seed = dataInfo.seedPersonalDetails;
        await PersonalDetailsPage.updateName(seed.firstName, seed.middleName, seed.lastName);
        await PersonalDetailsPage.successToast.waitForDisplayed();
        await browser.refresh();
    });

    beforeEach(async () => {
        await SideMenuComponent.goTo('My Info');
        await PersonalDetailsPage.headerTitle.waitForDisplayed();
    });

    it('MYINFO_TC01: View Personal Details', async () => {
        const testData = dataInfo.seedPersonalDetails;
        await expect(PersonalDetailsPage.emFirstNameTbx).toHaveValue(testData.firstName);
        await expect(PersonalDetailsPage.emMiddleNameTbx).toHaveValue(testData.middleName);
        await expect(PersonalDetailsPage.emLastNameTbx).toHaveValue(testData.lastName);
    });

    it('MYINFO_TC02 - Update First/Last Name successful', async () => {
        const testData = dataInfo.updateInfo;
        await PersonalDetailsPage.updateName(testData.firstName, '', testData.lastName);
        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await expect(PersonalDetailsPage.successToast).toHaveText(
            expect.stringContaining('Success')
        );
        await browser.refresh();
        await expect(PersonalDetailsPage.emFirstNameTbx).toHaveValue(testData.firstName);
        await expect(PersonalDetailsPage.emLastNameTbx).toHaveValue(testData.lastName);
    });

    it('MYINFO_TC03: Update without First Name', async () => {
        const testData = dataInfo.invalidPersonalDetails.emptyFirstName;
        const seed = dataInfo.seedPersonalDetails;
        await PersonalDetailsPage.updateName(testData.firstName, seed.middleName, seed.lastName);

        await expect(PersonalDetailsPage.requiredErrorMsg).toBeDisplayed();
        await expect(PersonalDetailsPage.requiredErrorMsg).toHaveText(testData.expectedError);

        await PersonalDetailsPage.clearField(PersonalDetailsPage.emFirstNameTbx);
        await PersonalDetailsPage.emFirstNameTbx.setValue(seed.firstName);
        await PersonalDetailsPage.savePersonalDetailsBtn.click();
        await PersonalDetailsPage.successToast.waitForDisplayed();
    });

    it('MYINFO_TC04: Input Employee ID', async () => {
        const employeeId = dataInfo.employeeId;
        await PersonalDetailsPage.updateEmployeeId(employeeId);

        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await browser.refresh();
        await expect(PersonalDetailsPage.employeeIdTbx).toHaveValue(employeeId);
    });

    it('MYINFO_TC05: Choose Nationality', async () => {
        const nationality = dataInfo.nationalityToSelect;
        await PersonalDetailsPage.selectNationality(nationality);

        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await browser.refresh();
        await expect(PersonalDetailsPage.nationalityTbx).toHaveText(nationality);
    });

    it('MYINFO_TC06: Choose Marital Status', async () => {
        const status = dataInfo.maritalStatusToSelect;
        await PersonalDetailsPage.selectMaritalStatus(status);

        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await browser.refresh();
        await expect(PersonalDetailsPage.martialStatusTbx).toHaveText(status);
    });

    it('MYINFO_TC07: Input valid Date of Birth', async () => {
        const dob = dataInfo.validDOB;
        await PersonalDetailsPage.updateDateOfBirth(dob.input);

        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await browser.refresh();
        await expect(PersonalDetailsPage.dateOfBirthTbx).toHaveValue(dob.displayedAfterSave);
    });

    it('MYINFO_TC08: Future Date of Birth is accepted', async () => {
        const dob = dataInfo.invalidPersonalDetails.futureDOB;
        await PersonalDetailsPage.updateDateOfBirth(dob.dateOfBirth);

        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await browser.refresh();
        await expect(PersonalDetailsPage.dateOfBirthTbx).toHaveValue(dob.dateOfBirth);
    });

    it('MYINFO_TC09: Manually input Date of Birth with wrong format', async () => {
        const testData = dataInfo.invalidPersonalDetails.dobWrongFormat;
        await PersonalDetailsPage.updateDateOfBirth(testData.dateOfBirth);

        await expect(PersonalDetailsPage.requiredErrorMsg).toBeDisplayed();
        await expect(PersonalDetailsPage.requiredErrorMsg).toHaveText(testData.expectedError);

        await PersonalDetailsPage.updateDateOfBirth(dataInfo.validDOB.input);
        await expect(PersonalDetailsPage.requiredErrorMsg).not.toExist();
    });

    it('MYINFO_TC10: Choose Gender', async () => {
        const gender = dataInfo.genderToSelect;
        await PersonalDetailsPage.selectGender(gender);

        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await browser.refresh();
        await expect(PersonalDetailsPage.getRadioGender(gender)).toBeChecked();
    });

    it('MYINFO_TC26: Name with Vietnamese diacritics is saved and displayed correctly', async () => {
        const { firstName, lastName } = dataInfo.vietnameseName;
        await PersonalDetailsPage.updateName(firstName, '', lastName);

        await expect(PersonalDetailsPage.successToast).toBeDisplayed();
        await browser.refresh();
        await expect(PersonalDetailsPage.emFirstNameTbx).toHaveValue(firstName);
        await expect(PersonalDetailsPage.emLastNameTbx).toHaveValue(lastName);
    });
});
