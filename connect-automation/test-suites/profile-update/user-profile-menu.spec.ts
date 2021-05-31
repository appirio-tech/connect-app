import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { UserProfileMenuHelper } from '../../page-objects/profile-update/user-profile-menu/user-profile-menu.helper';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - User Profile Menu Tests:', () => {
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
    // Initialize User Profile Menu Helper
    UserProfileMenuHelper.initialize();
  });

  it('[TC_005] should whether the user can navigate the page successfully from profile icon menu.', async () => {
    await UserProfileMenuHelper.verifyMyProfile();
    await UserProfileMenuHelper.verifyNotificationSettings();
    await UserProfileMenuHelper.verifyAccountAndSecurity();
    await UserProfileMenuHelper.verifyLogout();
  });
});
