import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { ProjectMilestonePageHelper } from '../../page-objects/project-milestone/project-milestone.helper';
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Create New Milestone Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    const customerUser = ConfigHelper.getCopilotUser();
    await CommonHelper.login(customerUser.email, customerUser.password);
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    await CommonHelper.logout();
  });

  beforeEach(async () => {
    ProjectMilestonePageHelper.initialize();
    await CommonHelper.goToRecentlyCreatedProject();
    await CommonHelper.waitForPageDisplayed();
  });

  it('[TC_001] Should verify user can create/Edit/Delete the MILESTONES', async () => {
    await ProjectMilestonePageHelper.verifyUserCanCreateEditDeleteMilestone(testData.projectMilestone);
  });

  it('[TC_002] Should verify user can add copilot on Milestone.', async () => {
    await ProjectMilestonePageHelper.verifyUserCanAddCopilotOnMilestone(testData.projectMilestone);
  });

  it('[TC_003] Should verify user can bulk update the milestone.', async () => {
    await ProjectMilestonePageHelper.deleteAllMilestones(testData.projectMilestone);
    const milestoneNames = await ProjectMilestonePageHelper.addMilestones(testData.projectMilestone, 2, testData.projectMilestone.active);
    await ProjectMilestonePageHelper.verifyUserCanBulkUpdateTheMilestone(testData.projectMilestone);
  });
});