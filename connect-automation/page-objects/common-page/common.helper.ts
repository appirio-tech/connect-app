import moment = require('moment');
import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../config/app-config.json';
import { logger } from '../../logger/logger';
import TcElement from '../../node_modules/topcoder-testing-lib/dist/src/tc-element';
import { TcElementImpl } from '../../node_modules/topcoder-testing-lib/dist/src/tc-element-impl';
import { ConfigHelper } from '../../utils/config-helper';
import { LoginPageHelper } from '../login/login.helper';

/**
 * Wait until condition return true
 * @param func function for checking condition
 * @param extraMessage extra error message when timeout
 * @param isPageLoad wait for loading page
 */
const waitUntil = async (
  func: () => any,
  extraMessage: string,
  isPageLoad: boolean
) => {
  await BrowserHelper.waitUntil(
    func,
    isPageLoad
      ? appconfig.Timeout.PageLoad
      : appconfig.Timeout.ElementVisibility,
    (isPageLoad
      ? appconfig.LoggerErrors.PageLoad
      : appconfig.LoggerErrors.ElementVisibilty) +
    '.' +
    extraMessage
  );
};

export const CommonHelper = {
  /**
   * Log in browser
   * @param username user name
   * @param password password
   */
  async login(username: string, password: string) {
    await BrowserHelper.initialize();
    await BrowserHelper.maximize();

    await LoginPageHelper.open();
    await LoginPageHelper.login(username, password);
  },

  /**
   * Log out browser
   */
  async logout() {
    try {
      await LoginPageHelper.logout();
    } catch (e) {
      await BrowserHelper.restart();
    }
  },

  /**
   * Wait until the element becomes visible
   * @param {TcElementImpl} tcElement element
   * @param {TcElementImpl} extraMessage extra message
   * @param {Boolean} isPageLoad is loading page
   */
  async waitUntilVisibilityOf(
    func: () => TcElement,
    extraMessage: string,
    isPageLoad: boolean
  ) {
    await waitUntil(
      () => async () => {
        try {
          return await func().isDisplayed();
        } catch {
          // element is not attached to the DOM of a page.
          return false;
        }
      },
      extraMessage,
      isPageLoad
    );
  },

  /**
   * Wait until the element is present
   * @param {TcElementImpl} tcElement element
   * @param {TcElementImpl} extraMessage extra message
   * @param {Boolean} isPageLoad is loading page
   */
  async waitUntilPresenceOf(
    func: () => TcElement,
    extraMessage: string,
    isPageLoad: boolean
  ) {
    await BrowserHelper.waitUntil(
      () => async () => {
        try {
          return await func().isPresent();
        } catch {
          // element is not attached to the DOM of a page.
          return false;
        }
      },
      isPageLoad
        ? appconfig.Timeout.PageLoad
        : appconfig.Timeout.ElementPresence,
      (isPageLoad
        ? appconfig.LoggerErrors.PageLoad
        : appconfig.LoggerErrors.ElementPresence) +
      '.' +
      extraMessage
    );
  },

  /**
   * Wait for Page to be displayed
   */
  async waitForPageDisplayed() {
    const rootId = ElementHelper.getElementById('root');

    await CommonHelper.waitUntilVisibilityOf(
      () => rootId,
      'Wait for home page',
      true
    );
    return rootId;
  },

  /**
   * Fill Input Field with value
   * @param el target element
   * @param value value to fill
   */
  async fillInputField(el: TcElementImpl, value: string) {
    el.click();
    await BrowserHelper.sleep(100);
    el.clear();
    await BrowserHelper.sleep(100);
    el.sendKeys(value);
  },

  /**
   * Select input by its containing text
   * @param text desired text value
   */
  async selectInputByContainingText(text: string) {
    const selectedOption = ElementHelper.getElementContainingText(text);
    await selectedOption.click();
  },

  /**
   * Get element that contain text
   * @param tag tag
   * @param text text contain
   * @param parent parent element
   */
  findElementByText(tag: string, text: string, parent?: TcElementImpl) {
    return ElementHelper.getElementByXPath(
      '//' + tag + '[contains(text(), "' + text + '")]',
      parent
    );
  },

  /**
   * Find desired value from dropdown menu
   * @param text search value
   * @param parent (optional) parent element
   */
  async findTextFromDropDown(text: string, parent?: TcElementImpl) {
    const xpath = `//div[contains(text(), "${text}")]`;
    const dropDowns = await ElementHelper.getAllElementsByXPath(xpath, parent);

    return dropDowns;
  },

  /**
   * Compare given url to current page's url
   * @param url expected page url
   */
  async verifyPageUrl(url: string) {
    const currentUrl = await BrowserHelper.getCurrentUrl();
    expect(currentUrl).toContain(url);
  },

  /**
   * Navigate to All Projects Page
   */
  async navigateToAllProjectsPage() {
    await BrowserHelper.open(ConfigHelper.getAllProjectsUrl());
    await CommonHelper.waitForPageDisplayed();
    await BrowserHelper.sleep(5000);
  },

  /**
   * Append date time to given input text
   * @param inputText input text
   */
  appendDate(inputText: string) {
    return `${inputText}-${moment().format()}`;
  },

  /**
   * Get Project Title
   */
  projectTitle() {
    return ElementHelper.getElementByClassName('_1Iqc2q');
  },

  /**
   * Get Page Title
   */
  pageTitle() {
    return ElementHelper.getElementByClassName('TopBarContainer');
  },

  /**
   * Get Loading Indicator
   */
  loadingIndicator() {
    return ElementHelper.getElementByClassName('loading-indicator');
  },

  /**
   * Wait for project title to appear
   */
  async waitForProjectTitle() {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.projectTitle(),
      'Wait for project title',
      true
    );
    logger.info('My Project Page Loaded');
  },

  /**
   * Wait for page title to appear
   */
  async waitForPageTitle() {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.pageTitle(),
      'Wait for project title',
      true
    );
    logger.info('Home Page Loaded');
  },

  /**
   * Get recent project title element
   * @param isCustomer true if current logged in user had customer role
   */
  async firstProject(isCustomer = false) {
    const projectClassName = isCustomer ? 'project-header-details' : 'project-title'
    const titles = await ElementHelper.getAllElementsByClassName(projectClassName);

    return titles[0];
  },

  /**
   * Navigate to first Project From Dashboard
   * @param isCustomer true if current logged in user had customer role
   */
  async goToRecentlyCreatedProject(isCustomer = false) {
    await BrowserHelper.sleep(40000);
    await BrowserHelper.waitUntilVisibilityOf(await this.firstProject(isCustomer));
    const title = await this.firstProject(isCustomer);
    await BrowserHelper.waitUntilClickableOf(title);
    await title.click();
  },

  /**
   * Get Alert Box Element
   */
  alertBox() {
    return ElementHelper.getElementByClassName('s-alert-box-inner');
  },

  /**
   * Get Success Alert Span
   */
  successAlert() {
    return ElementHelper.getElementByTag('span', this.alertBox());
  },

  /**
   * Wait for success alert to show
   */
  async waitForSuccessAlert(target: TcElementImpl) {
    await CommonHelper.waitUntilVisibilityOf(
      () => target,
      'Wait for success alert message',
      true
    );
    logger.info('Success Alert Displayed');
  },

  /**
   * Wait until element visibility and click
   */
  async waitAndClickElement(targetEl: TcElementImpl) {
    await BrowserHelper.waitUntilVisibilityOf(targetEl);
    await targetEl.click();
  },

  /**
   * Verify success alert shows correct message
   * @param expectedText expected success text to appear
   */
  async verifySuccessAlert(expectedText: string) {
    await this.waitForSuccessAlert(this.alertBox());
    expect(await this.successAlert().getText()).toBe(expectedText);
  },

  /**
   * Necessary input format for calendar input
   */
  dateFormat() {
    return '00YYYYMMDD';
  },

  /**
   * Get Create Phase Page title
   */
  get createPhasePageTitle() {
    return ElementHelper.getElementByClassName('_2edGvU');
  },

  /**
   * Wait for Page Element to be displayed
   */
  async waitForElementToGetDisplayed(element) {
    await CommonHelper.waitUntilVisibilityOf(
      () => element,
      'Wait for Element To get Displayed',
      true
    );
    return element;
  },

  /**
   * Get Alert Box
   */
  get getAlertBox() {
    BrowserHelper.sleep(1000);
    return ElementHelper.getElementByXPath('//div[@class="s-alert-box-inner"]/span');
  },

  /**
   * Checks if element is present or not on page
   * 
   * @param identifierType Type of Identifier
   * @param identifierValue Identifier Value to search
   * 
   * @returns Either True or False
   */
   async isElementPresent(identifierType: string, identifierValue: string) {
     let isElementPresent = true;
     let element: TcElementImpl;
     try {
       switch(identifierType.toLowerCase()) {
         case 'xpath': element = ElementHelper.getElementByXPath(identifierValue); break;
       }
       const isElementDisplayed = await element.isDisplayed();
       const isElementEnabled = await element.isEnabled();
       isElementPresent = (isElementDisplayed && isElementEnabled) ? true: false;
     } catch(error) {
       isElementPresent = false;
     }
     return isElementPresent;
  },

  /**
   * Get Join Project Button
   */
  get joinProjectButton() {
      return ElementHelper.getElementByButtonText('Join project');
  },
};
