import { ElementHelper } from 'topcoder-testing-lib';

export class UserProfilePageObject {
  /**
   * Get Menu Dropdown Element
   */
  public get menuDropdown() {
    return ElementHelper.getElementByClassName('menu-wrap');
  }

  /**
   * Get My Profile Link
   */
  public get myProfileLink() {
    return ElementHelper.getElementByLinkText('My profile');
  }

  /**
   * Get Notification Settings Link
   */
  public get notificationSettingsLink() {
    return ElementHelper.getElementByLinkText('Notification settings');
  }

  /**
   * Get Account & Security Link
   */
  public get accountSecurityLink() {
    return ElementHelper.getElementByLinkText('Account & security');
  }

  /**
   * Get Logout Link
   */
  public get logoutLink() {
    return ElementHelper.getElementByLinkText('Log out');
  }
}
