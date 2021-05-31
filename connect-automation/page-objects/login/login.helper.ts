import { BrowserHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../common-page/common.helper';
import { LoginPage } from './login.po';

export class LoginPageHelper {
  /**
   * Set the page object
   * @param loginPage login Page
   */
  public static setLoginPage(loginPage: LoginPage) {
    this.loginPageObject = loginPage;
  }

  /**
   * Open page
   */
  public static async open() {
    this.loginPageObject = new LoginPage();
    await this.loginPageObject.open();
  }

  /**
   * Login
   * @param {String} username
   * @param {String} password
   */
  public static async login(username: string, password: string) {
    await this.loginPageObject.waitForLoginForm();
    await this.loginPageObject.fillLoginForm(username, password);
    await CommonHelper.waitForPageDisplayed();
  }

  /**
   * Logout
   */
  public static async logout() {
    await this.loginPageObject.logout();
    await BrowserHelper.sleep(5000);
  }

  private static loginPageObject: LoginPage;
}
