import { ElementHelper } from 'topcoder-testing-lib';

export class LeftMenuPageObject {
  /**
   * Get My Profile Link Element
   */
  public get myProfileLink() {
    return ElementHelper.getElementContainingText('MY PROFILE');
  }

  /**
   * Get Sub Menus
   */
  public async getSubmenus() {
    return ElementHelper.getAllElementsByClassName('_1l5nE0 _3wRYsd');
  }

  /**
   * Get Profile Information Link
   */
  public async profileInformationLink() {
    const menus = await this.getSubmenus();
    return menus[0];
  }

  /**
   * Get Notification Settings Link
   */
  public async notificationSettingsLink() {
    const menus = await this.getSubmenus();
    return menus[1];
  }

  /**
   * Get Account & Security Link
   */
  public async accountAndSecurityLink() {
    const menus = await this.getSubmenus();
    return menus[2];
  }

  /**
   * Get All Projects Link
   */
  public get allProjectsLink() {
    return ElementHelper.getElementContainingText('ALL PROJECTS');
  }

  /**
   * Get Notifications Link
   */
  public get notificationsLink() {
    return ElementHelper.getElementContainingText('NOTIFICATIONS');
  }
}
