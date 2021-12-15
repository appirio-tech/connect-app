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
    await BrowserHelper.waitUntilClickableOf(
      this.startAProjectButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
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
   * Get Username field
   */
   public get loginWindow() {
    return ElementHelper.getElementById('hiw-login-container');
  }

  /**
   * Get Start A Project button
   */
  public get startAProjectButton() {
    return ElementHelper.getElementByXPath('//a[contains(@class, "tc-btn-primary")]');
  }

  /**
   * Wait for the login form to be displayed
   */
   public async waitForLoginForm() {
    // Wait until login form appears
    await CommonHelper.waitForElementToGetDisplayed(this.loginWindow)
    await BrowserHelper.waitUntilClickableOf(
      this.loginButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
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

    await CommonHelper.waitForElementToGetDisplayed(this.allProjectsTable)
  }

  /**
   * Get All Projects Table
   */
  public get allProjectsTable() {
    return ElementHelper.getElementByXPath('//div[@class="flex-area"] | //div[contains(@class, "card-view")]');
  }
}
