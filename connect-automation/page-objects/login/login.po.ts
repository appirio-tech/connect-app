import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../config/app-config.json';
import { logger } from '../../logger/logger';
import { ConfigHelper } from '../../utils/config-helper';
import { CommonHelper } from '../common-page/common.helper';

export class LoginPage {
  /**
   * Get login page
   */
  public async open() {
    await BrowserHelper.open(ConfigHelper.getRedirectLoginUrl());
    logger.info('User navigated to Topcoder Login Page');
  }

  /**
   * Logout the user
   */
  public async logout() {
    await BrowserHelper.open(ConfigHelper.getLogoutUrl());
    logger.info('user logged out');
  }

  /**
   * Get Username field
   */
  public get userNameField() {
    return ElementHelper.getElementByName('username');
  }

  /**
   * Get Password field
   */
  public get passwordField() {
    return ElementHelper.getElementByName('password');
  }

  /**
   * Get Login button
   */
  public get loginButton() {
    return ElementHelper.getElementByCss("button[type = 'submit']");
  }

  /**
   * Get login form
   */
  public get loginForm() {
    return ElementHelper.getElementByClassName('auth0-lock-widget');
  }

  /**
   * Wait for the login form to be displayed
   */
  public async waitForLoginForm() {
    // Wait until login form appears
    await BrowserHelper.sleep(8000);
    CommonHelper.waitUntilVisibilityOf(
      () => this.loginForm,
      'Wait for login form',
      true
    );
    logger.info('Login Form Displayed');
  }

  /**
   * Fill and submit the login form
   */
  public async fillLoginForm(username, password) {
    await CommonHelper.waitUntilPresenceOf(
      () => this.userNameField,
      'wait for username field',
      false
    );
    await this.userNameField.sendKeys(username);
    await this.passwordField.sendKeys(password);
    logger.info(
      'Login form filled with values: username - ' +
        username +
        ', password - FILTERED'
    );
    await BrowserHelper.waitUntilClickableOf(
      this.loginButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
    await this.loginButton.click();
    logger.info('Submitted login form');
  }
}
