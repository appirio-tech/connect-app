import { CommonHelper } from '../../page-objects/common-page/common.helper';
import { CreateProjectPageHelper } from '../../page-objects/project-creation-flow/create-project/create-project.helper';
import * as testData from '../../test-data/test-data.json';
import { ConfigHelper } from '../../utils/config-helper';

describe('Connect App - Create Project Tests:', () => {
  /**
   * Sets up the browser
   */
  beforeAll(async () => {
    // Precondition: User should be logged in with Customer Role.
    const customerUser = ConfigHelper.getCustomerUser();
    await CommonHelper.login(customerUser.email, customerUser.password);
  });

  /**
   * Logs out
   */
  afterAll(async () => {
    await CommonHelper.logout();
  });

  beforeEach(async () => {
    CreateProjectPageHelper.initialize();
    // Step Sequence #1: Go to the given app URL
    await CreateProjectPageHelper.open();
  });

  it('[TC_001] should verify whether the current user can create a Design, Development & Deployment project', async () => {
    await CreateProjectPageHelper.verifyProjectCreation(testData.projectData);
  });

  it('[TC_006] should verify whether the current user can create a TAAS project', async () => {
    await CreateProjectPageHelper.verifyTaasProject(testData.taas);
  });
});
