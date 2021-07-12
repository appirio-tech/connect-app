import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { FooterHelper } from '../../page-objects/profile-update/footer/footer.helper';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Footer Menu Tests:', () => {
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
    // Initialize Footer Menu Helper
    FooterHelper.initialize();
  });

  it('[TC_006] should verify copyright year is displaying correctly.', async () => {
    await FooterHelper.verifyCopyright();
  });
});
