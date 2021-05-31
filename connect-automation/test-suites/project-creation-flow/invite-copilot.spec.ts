import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { InviteCopilotHelper } from '../../page-objects/project-creation-flow/invite-copilot/invite-copilot.helper';
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Invite Copilot Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    // Precondition: User should be logged in with Copilot Manager role.
    const copilotManagerUser = ConfigHelper.getCopilotManagerUser();
    await CommonHelper.login(copilotManagerUser.email, copilotManagerUser.password);
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    await CommonHelper.logout();
  });

  beforeEach(async () => {
    InviteCopilotHelper.initialize();
    // Step Sequence #1: Go to the given app URL
    await InviteCopilotHelper.open();
  });

  it('[TC_002] should verify whether the Copilot Manager can invite to project', async () => {
    await InviteCopilotHelper.verifyManageProject(testData.inviteCopilot.copilotHandle);
  });
});
