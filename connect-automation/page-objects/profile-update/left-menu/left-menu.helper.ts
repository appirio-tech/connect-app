import { logger } from '../../../logger/logger';
import { ConfigHelper } from '../../../utils/config-helper';
import { CommonHelper } from '../../common-page/common.helper';
import { LeftMenuPageObject } from './left-menu.po';

export class LeftMenuPageHelper {
  /**
   * Initialize Left Menu Page Object
   */
  public static initialize() {
    this.leftMenuPageObject = new LeftMenuPageObject();
  }

  /**
   * Verify Profile Information Link redirected correctly
   */
  public static async verifyProfileInformation() {
    const profileInfo = await this.leftMenuPageObject.profileInformationLink();
    await profileInfo.click();
    await CommonHelper.waitForPageDisplayed();

    await CommonHelper.verifyPageUrl(ConfigHelper.getMyProfileUrl());
  }

  /**
   * Verify Notification Settings Link redirected correctly
   */
  public static async verifyNotificationSettings() {
    const notificationSettings = await this.leftMenuPageObject.notificationSettingsLink();
    await notificationSettings.click();
    await CommonHelper.waitForPageDisplayed();
    logger.info('User navigated to Notification Settings Page');

    await CommonHelper.verifyPageUrl(ConfigHelper.getNotificationSettingsUrl());
  }

  /**
   * Verify Account & Security Link redirected correctly
   */
  public static async verifyAccountAndSecurity() {
    const accountAndSecurity = await this.leftMenuPageObject.accountAndSecurityLink();
    await accountAndSecurity.click();
    await CommonHelper.waitForPageDisplayed();
    logger.info('User navigated to Account & Security Page');

    await CommonHelper.verifyPageUrl(ConfigHelper.getAccountAndSecurityUrl());
  }

  /**
   * Verify All Projects redirected correctly
   */
  public static async verifyAllProjects() {
    await this.leftMenuPageObject.allProjectsLink.click();
    await CommonHelper.waitForPageDisplayed();
    logger.info('User navigated to All Projects Page');

    await CommonHelper.verifyPageUrl(ConfigHelper.getAllProjectsUrl());
  }

  /**
   * Verify Notification Link redirected to correctly
   */
  public static async verifyNotifications() {
    await this.leftMenuPageObject.notificationsLink.click();
    await CommonHelper.waitForPageDisplayed();
    logger.info('User navigated to Notifications Page');

    await CommonHelper.verifyPageUrl(ConfigHelper.getNotificationUrl());
  }

  private static leftMenuPageObject: LeftMenuPageObject;
}
