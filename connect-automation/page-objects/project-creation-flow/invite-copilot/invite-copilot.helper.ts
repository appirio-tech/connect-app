import { BrowserHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../../config/app-config.json';
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
  }

  /**
   * Send the invitation to Copilot Manager
   * @param copilotHandle copilot handle from test data
   */
  private static async sendInvitationToCopilot(copilotHandle: string) {
    const inputField = this.inviteCopilotPageObject.inviteInputField;
    await this.inviteCopilotPageObject.dropdownElement.click();
    await inputField.sendKeys(copilotHandle);
    await this.inviteCopilotPageObject.selectedOption.click();
    await BrowserHelper.waitUntilClickableOf(
      this.inviteCopilotPageObject.sendInviteButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
    await this.inviteCopilotPageObject.sendInviteButton.click();

    const message = await CommonHelper.getAlertMessageAndClosePopup();
    expect(message).toEqual(`YOU'VE SUCCESSFULLY INVITED MEMBER(S).`);
  }
}
