import SideMenuComponent from '../../pageobjects/components/SideMenuComponent.js';
import AvatarPage from '../../pageobjects/myinfo-page/AvatarPage.js';
import { dataInfo } from '../../data/myinfo.js';

describe('OrangeHRM - My Info - Avatar', () => {
    beforeEach(async () => {
        await SideMenuComponent.goTo('My Info');
        await AvatarPage.editAvatarBtn.click();
        await AvatarPage.headerTitle.waitForDisplayed();
    });

    it ('MYINFO_TC18: Upload Avatar with a valid image)', async () => {
        await AvatarPage.uploadAndSave(dataInfo.avatar.validImage);

        await expect(AvatarPage.successToast).toBeDisplayed();
        await expect(AvatarPage.successToast).toHaveText(expect.stringContaining('Success'));
    });

    it('MYINFO_TC19: Upload Avatar with an invalid format)', async () => {
        await AvatarPage.uploadFile(dataInfo.avatar.invalidFormatFile);

        await expect(AvatarPage.errorMsg).toBeDisplayed();
        await expect(AvatarPage.errorMsg).toHaveText(dataInfo.avatar.invalidFormatError);
    });

    it('MYINFO_TC20: Upload Avatar with an oversized file)', async () => {
        await AvatarPage.uploadFile(dataInfo.avatar.oversizedImage);

        await expect(AvatarPage.errorMsg).toBeDisplayed();
        await expect(AvatarPage.errorMsg).toHaveText(dataInfo.avatar.oversizedError);
    });
});
