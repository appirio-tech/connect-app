import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { CreateNewPhaseHelper } from '../../page-objects/phase-creation-flow/create-new-phase/create-new-phase.helper';
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Create New Phase Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    // Precondition: User should be logged in with Copilot role.
    const copilotUser = ConfigHelper.getCopilotUser();
    await CommonHelper.login(copilotUser.email, copilotUser.password);
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    await CommonHelper.logout();
  });

  beforeEach(async () => {
    CreateNewPhaseHelper.initialize();
    // Step Sequence #1: Go to the given app URL
    await CommonHelper.goToRecentlyCreatedProject();
  });

  it('[TC_001] should verify user can create a Phase and Publish it.', async () => {
    await CreateNewPhaseHelper.verifyCreateNewPhase(
      testData.phaseCreation.formData
    );
  });
});
