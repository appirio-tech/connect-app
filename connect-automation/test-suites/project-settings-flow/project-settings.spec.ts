import { BrowserHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { ProjectSettingsPageHelper } from '../../page-objects/project-settings/project-settings.helper'
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Project Settings Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    // Precondition: User should be logged in with Customer Role.
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
    ProjectSettingsPageHelper.initialize();
  });

  it('[TC_001] Should verify user can update Project Details ( eg NDA, Default Group)', async () => {
    await CommonHelper.goToRecentlyCreatedProject();
    await ProjectSettingsPageHelper.openSettings();
    // Resetting Existing Project Settings
    await ProjectSettingsPageHelper.resetSettings();

    // Editing Project Settings
    await ProjectSettingsPageHelper.editProjectSettings(testData.projectSettings);
  });

  it('[TC_002] Should verify system showing Billing Account expiry information.', async () => {
    await ProjectSettingsPageHelper.openExpiredProject();
    await ProjectSettingsPageHelper.openSettings();
    await ProjectSettingsPageHelper.verifyAccountExpiryInformation();
  });

  it('[TC_003] Should verify user can Add/Edit/Delete/Download Files', async () => {
    await CommonHelper.goToRecentlyCreatedProject();
    await BrowserHelper.sleep(5000);
    await CommonHelper.waitForAddNewMilestones();
    await ProjectSettingsPageHelper.verifyUserCanAddEditDeleteDownloadFiles(testData.projectSettings);
  });

  it('[TC_004] Should verify user can Add/Edit/Delete/Download Links', async () => {
    await CommonHelper.goToRecentlyCreatedProject();
    await BrowserHelper.sleep(5000);
    await CommonHelper.waitForAddNewMilestones();
    await ProjectSettingsPageHelper.verifyUserCanAddEditDeleteDownloadLinks(testData.projectSettings);
  });

  it('[TC_005] Should verify user can Add Message with Files Attachment', async () => {
    await CommonHelper.goToRecentlyCreatedProject();
    await BrowserHelper.sleep(5000);
    await CommonHelper.waitForAddNewMilestones();
    await ProjectSettingsPageHelper.verifyUserCanAddMessageWithFileAttachment(testData.projectSettings);
  });
});
