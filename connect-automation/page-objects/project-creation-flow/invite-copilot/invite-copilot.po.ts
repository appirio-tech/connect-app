import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../logger/logger';
import { ConfigHelper } from '../../../utils/config-helper';

export class InviteCopilotPageObject {
  /**
   * Open Home page
   */
  public static async open() {
    await BrowserHelper.open(ConfigHelper.getHomePageUrl());
    logger.info('User navigated to Home Page');
  }

  /**
   * Get Manage Copilot Link From Left Menu
   */
  public get manageCopilotLink() {
    const copilotDiv = ElementHelper.getElementByCssContainingText(
      'span._1hKIoG',
      'Copilot'
    );

    return ElementHelper.getElementByXPath(
      'following-sibling::span',
      copilotDiv
    );
  }

  /**
   * Get Copilot invitation dropdown element
   */
  public get dropdownElement() {
    return ElementHelper.getElementByClassName('react-select__placeholder');
  }

  /**
   * Get Copilot invitation input field
   */
  public get inviteInputField() {
    const parentEl = ElementHelper.getElementByClassName('react-select__input');
    return ElementHelper.getElementByTag('input', parentEl);
  }

  /**
   * Get Selected option element from dropdown
   */
  public get selectedOption() {
    return ElementHelper.getElementByClassName(
      'react-select__option--is-focused'
    );
  }

  /**
   * Get Send Invite button
   */
  public get sendInviteButton() {
    return ElementHelper.getElementByButtonText('Send Invite');
  }

  /**
   * Get Invited Copilots List Elements
   */
  public async invitedCopilots() {
    return ElementHelper.getAllElementsByClassName('span-name');
  }
}
