import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { LeftMenuPageHelper } from '../../page-objects/profile-update/left-menu/left-menu.helper';
import { ConfigHelper } from '../../utils/config-helper';
import { MyProfilePageHelper } from '../../page-objects/profile-update/my-profile/my-profile.helper';

describe('Connect App - Left Menu Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    // Precondition: User should be logged in.
    await CommonHelper.login(
      ConfigHelper.getUserName(),
      ConfigHelper.getPassword()
    );
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    await CommonHelper.logout();
  });

  beforeEach(async () => {
    MyProfilePageHelper.initialize();
    LeftMenuPageHelper.initialize();
    await MyProfilePageHelper.open();
  });

  it('[TC_004] should verify whether the user can navigate the page successfully.', async () => {
    await LeftMenuPageHelper.verifyNotificationSettings();
    await LeftMenuPageHelper.verifyProfileInformation();
    await LeftMenuPageHelper.verifyAccountAndSecurity();
    await LeftMenuPageHelper.verifyAllProjects();
    await LeftMenuPageHelper.verifyNotifications();
  });
});
