import * as config from '../config/config.json';

export const ConfigHelper = {
  /**
   * Get current config
   */
  getConfig() {
    return config;
  },

  /**
   * Get login URL
   */
  getLoginUrl() {
    return this.getConfig().loginUrl;
  },

  /**
   * Get homepage URL
   */
  getHomePageUrl(): string {
    return this.getConfig().homePageUrl;
  },

  /**
   * Get Redirected login URL
   */
  getRedirectLoginUrl() {
    return this.getConfig().redirectLoginUrl;
  },

  /**
   * Get logout URL
   */
  getLogoutUrl() {
    return this.getConfig().logoutUrl;
  },

  /**
   * Get Username
   */
  getUserName() {
    return this.getConfig().username;
  },

  /**
   * Get Password
   */
  getPassword() {
    return this.getConfig().password;
  },

  /**
   * Get My Profile Page Url
   */
  getMyProfileUrl() {
    return this.getConfig().myProfileUrl;
  },

  /**
   * Get Notification Settings Page Url
   */
  getNotificationSettingsUrl() {
    return this.getConfig().notificationSettingsUrl;
  },

  /**
   * Get Account & Security Page Url
   */
  getAccountAndSecurityUrl() {
    return this.getConfig().accountAndSecurityUrl;
  },

  /**
   * Get Notification Settings Page Url
   */
  getNotificationUrl() {
    return this.getConfig().notificationsUrl;
  },

  /**
   * Get All Projects Page Url
   */
  getAllProjectsUrl() {
    return this.getConfig().allProjectsUrl;
  },

  /**
   * Gets email, password of customer user
   */
  getCustomerUser() {
    return this.getConfig().customerRole;
  },

  /**
   * Gets email, password of copilot user
   */
  getCopilotUser() {
    return this.getConfig().copilotRole;
  },

  /**
   * Gets email, password of copilot manager user
   */
  getCopilotManagerUser() {
    return this.getConfig().copilotManagerRole;
  },
};
