import { CommonHelper } from '../../page-objects/common-page/common.helper';
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';
import { MyProfilePageHelper } from '../../page-objects/profile-update/my-profile/my-profile.helper';

describe('Connect App - My Profile Page Tests:', () => {
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
    await MyProfilePageHelper.open();
  });

  it('[TC_001] should verify whether the current user can update the basic information.', async () => {
    await MyProfilePageHelper.verifyProfileInformation(testData.userProfile);
  });

  it('[TC_002] should verify whether the Business Phone/Country sync accordingly.', async () => {
    await MyProfilePageHelper.verifyBusinessPhoneSync(testData.userProfile);
  });

  it('[TC_003] should verify whether the user can close the profile window.', async () => {
    await MyProfilePageHelper.verifyUserCloseProfileWindow();
  });
});
