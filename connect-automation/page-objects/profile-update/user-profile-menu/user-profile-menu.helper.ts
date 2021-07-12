import { ConfigHelper } from '../../../utils/config-helper';
import { CommonHelper } from '../../common-page/common.helper';
import { UserProfilePageObject } from './user-profile-menu.po';

export class UserProfileMenuHelper {
  /**
   * Initialize User Profile Page Object
   */
  public static initialize() {
    this.userProfilePageObject = new UserProfilePageObject();
  }

  /**
   * Opens Profile Menu from right top corner section
   */
  public static async openMenuDropdown() {
    await CommonHelper.navigateToAllProjectsPage();
    await this.userProfilePageObject.menuDropdown.click();
  }

  /**
   * Verify My Profile Page redirects to correct url
   */
  public static async verifyMyProfile() {
    await this.openMenuDropdown();
    await this.userProfilePageObject.myProfileLink.click();
    await CommonHelper.verifyPageUrl(ConfigHelper.getMyProfileUrl());
  }

  /**
   * Verify Notification Settings button redirects correctly
   */
  public static async verifyNotificationSettings() {
    await this.openMenuDropdown();
    await this.userProfilePageObject.notificationSettingsLink.click();
    await CommonHelper.verifyPageUrl(ConfigHelper.getNotificationSettingsUrl());
  }

  /**
   * Verify Account & Security button redirects correctly
   */
  public static async verifyAccountAndSecurity() {
    await this.openMenuDropdown();
    await this.userProfilePageObject.accountSecurityLink.click();
    await CommonHelper.verifyPageUrl(ConfigHelper.getAccountAndSecurityUrl());
  }

  /**
   * Verify Logout button redirects to home page.
   */
  public static async verifyLogout() {
    await this.openMenuDropdown();
    await this.userProfilePageObject.logoutLink.click();
    await CommonHelper.verifyPageUrl(ConfigHelper.getHomePageUrl());
  }

  private static userProfilePageObject: UserProfilePageObject;
}
