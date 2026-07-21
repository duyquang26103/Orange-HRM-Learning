import LoginPage from '../../pageobjects/LoginPage.js';
import SideMenuComponent from '../../pageobjects/components/SideMenuComponent.js';
import PersonalDetailsPage from '../../pageobjects/myinfo-page/PersonalDetailsPage.js';
import myinfo from '../../data/myinfo.json';

describe('OrangeHRM - My Info - Personal Details', () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login('Daisy', 'Da1sy@123');
    await SideMenuComponent.goTo('My Info');
    await PersonalDetailsPage.headerTitle.waitForDisplayed({ timeout: 5000 });
  })

  it('MYINFO_TC01: Xem thông tin Personal Details', async () => {
    const testData = myinfo.validPersonalDetails;
    // const firstname = await PersonalDetailsPage.emFristNameTbx.getValue();
    // console.log('First Name is:', firstname, '|', testData.firstName);
    await expect(PersonalDetailsPage.emFirstNameTbx).toHaveValue(testData.firstName);

    await expect(PersonalDetailsPage.emMiddleNameTbx).toHaveValue(testData.middleName);
    await expect(PersonalDetailsPage.emLastNameTbx).toHaveValue(testData.lastName);

  })
  it.only('MYINFO_TC02 - Cập nhật First/Last Name thành công', async () => {
    const testData = myinfo.updateName;
    await PersonalDetailsPage.updateName(testData.firstName, '', testData.lastName);
    await expect(PersonalDetailsPage.successToast).toBeDisplayed();
    await expect(PersonalDetailsPage.successToast).toHaveText(expect.stringContaining('Success'));

    await browser.refresh();
    await expect(PersonalDetailsPage.emFristNameTbx).toHaveValue(testData.firstName);
    await expect(PersonalDetailsPage.emLastNameTbx).toHaveValue(testData.lastName);
  });
})

