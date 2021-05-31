import { BrowserHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { ProjectsHelper } from '../../page-objects/project-creation-flow/projects/projects.helper';
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Copilot Role Project Related Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    // Precondition: User should be logged in with Copilot Role.
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
    ProjectsHelper.initialize();

    // Step Sequence #1: Go to the given app URL
    await ProjectsHelper.open();
  });

  it('[TC_003] should verify whether the Copilot can Join the project', async () => {
    await ProjectsHelper.verifyCopilotProjectJoin();
  });

  it('[TC_004] should verify user can search for projects using project name, user handle, ref code', async () => {
    await ProjectsHelper.verifyProjectSearch(testData.searchProject);

    // Logout from current user.
    await CommonHelper.logout();
    await BrowserHelper.sleep(5000);
    expect(await BrowserHelper.getCurrentUrl()).toBe(
      ConfigHelper.getHomePageUrl()
    );
    // Login again to execute next test.
    const copilotManagerUser = ConfigHelper.getCopilotUser();
    await CommonHelper.login(
      copilotManagerUser.email,
      copilotManagerUser.password
    );
  });

  it('[TC_005] should verify user can switch between the Project tabs', async () => {
    await ProjectsHelper.verifySwitchTabs();
  });
});
