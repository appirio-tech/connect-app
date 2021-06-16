import { BrowserHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../../common-page/common.helper';
import { InviteCopilotPageObject } from './invite-copilot.po';

export class InviteCopilotHelper {
  /**
   * Initialize Invite Copilot page object
   */
  public static initialize() {
    this.inviteCopilotPageObject = new InviteCopilotPageObject();
  }

  /**
   * Open Home Page
   */
  public static async open() {
    await InviteCopilotPageObject.open();
    await CommonHelper.waitForPageDisplayed();
    // await BrowserHelper.sleep(8000);
  }

  /**
   * Verify whether the Copilot Manager can invite to project
   * @param copilotHandle copilot handle from test data
   */
  public static async verifyManageProject(copilotHandle: string) {
    await CommonHelper.goToRecentlyCreatedProject();
    await this.clickOnManageLink();
    await this.sendInvitationToCopilot(copilotHandle);
  }

  private static inviteCopilotPageObject: InviteCopilotPageObject;

  /**
   * Click on Manage link of Copilot Section of Left menu
   */
  private static async clickOnManageLink() {
    await CommonHelper.waitAndClickElement(this.inviteCopilotPageObject.manageCopilotLink);
    await BrowserHelper.sleep(2000);
  }

  /**
   * Send the invitation to Copilot Manager
   * @param copilotHandle copilot handle from test data
   */
  private static async sendInvitationToCopilot(copilotHandle: string) {
    const inputField = this.inviteCopilotPageObject.inviteInputField;
    await this.inviteCopilotPageObject.dropdownElement.click();
    await BrowserHelper.sleep(200);
    await inputField.sendKeys(copilotHandle);
    await this.inviteCopilotPageObject.selectedOption.click();
    await this.inviteCopilotPageObject.sendInviteButton.click();
    const alertElement = CommonHelper.alertBox();
    await CommonHelper.waitForSuccessAlert(alertElement);

    expect(await CommonHelper.successAlert().getText()).toBe(
      `YOU'VE SUCCESSFULLY INVITED MEMBER(S).`
    );
  }
}
