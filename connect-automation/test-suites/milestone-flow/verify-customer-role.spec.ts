import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { ProjectMilestonePageHelper } from '../../page-objects/project-milestone/project-milestone.helper';
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Verify Customer Role Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    const user = ConfigHelper.getCopilotUser();
    await CommonHelper.login(user.email, user.password);
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    await CommonHelper.logout();
  });

  beforeEach(async () => {
    ProjectMilestonePageHelper.initialize();
    // Go to the given app URL
    await ProjectMilestonePageHelper.open();
  });

  it('[TC_004] Should verify Add Milestone button and Draft Milestone should not be displayed for customer role.', async () => {
    const customerUser = ConfigHelper.getCustomerUser();
    await ProjectMilestonePageHelper.verifyAddMilestoneButtonAndDraftMilestoneShouldNotBeDisplayed(testData.projectMilestone, customerUser);
  });
});