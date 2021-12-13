import moment = require('moment');
import { browser, protractor } from 'protractor'
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

const alertBoxXpath = '//div[@class="s-alert-box-inner"]/span';
const closeIconXpath = '//span[@class="s-alert-close"]';
const projectTableXpath = '//div[@class="flex-data"]';
const customerProjectsXpath = '//div[@class="project-header-details"]';
const contentWrapperXpath = '//div[@class="twoColsLayout-contentInner"]';
const milestoneXpath = "//th[contains(text(),'MILESTONE')]";
const addNewMilestonesXpath = "//button[contains(text(),'Add New Milestone')] | //button[text()='ADD']";

export const CommonHelper = {
  /**
   * Log in browser
   * @param username user name
   * @param password password
   */
  async login(username: string, password: string) {
    await BrowserHelper.initialize();
    logger.info('Starting Browser');
    await BrowserHelper.maximize();
    logger.info('Maximizing Browser')

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
      await this.listenersCleanup();
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
    await el.click();
    await el.clear();
    await el.sendKeys(value);
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
   * Get Loading Indicator
   */
  get projectList() {
    return ElementHelper.getElementByXPath(projectTableXpath)
  },

  /**
   * Get Content Wrapper
   */
  get contentWrapper() {
    return ElementHelper.getElementByXPath(contentWrapperXpath)
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
  firstProject() {
    const firstProjectXpath = '(//div[@class="project-name"] | //a[@class="link-title"])[1]'
    return ElementHelper.getElementByXPath(firstProjectXpath)
  },

  /**
   * Navigate to first Project From Dashboard
   * @param isCustomer true if current logged in user had customer role
   */
  async goToRecentlyCreatedProject(isCustomer = false) {
    await BrowserHelper.open(ConfigHelper.getHomePageUrl());
    await this.waitForElementToGetDisplayed(this.allProjectsTable());
    await this.waitForElementToGetDisplayed(this.firstProject());
    await this.firstProject().click();
    logger.info('Clicked on Recently Created Project');
  },

  /**
   * Wait until element visibility and click
   */
  async waitAndClickElement(targetEl: TcElementImpl) {
    await BrowserHelper.waitUntilVisibilityOf(targetEl);
    await targetEl.click();
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
  async waitForElementToGetDisplayed(webElement: TcElement) {
    await CommonHelper.waitUntilVisibilityOf(
      () => webElement,
      'Wait for Element To get Displayed',
      true
    );
    return webElement;
  },

  /**
   * Get Alert Box
   */
  get getAlertBox() {
    return ElementHelper.getElementByXPath(alertBoxXpath);
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
    let webElement: TcElementImpl;
    try {
      switch (identifierType.toLowerCase()) {
        case 'xpath': webElement = ElementHelper.getElementByXPath(identifierValue); break;
      }
      const isElementDisplayed = await webElement.isDisplayed();
      const isElementEnabled = await webElement.isEnabled();
      isElementPresent = (isElementDisplayed && isElementEnabled) ? true : false;
    } catch (error) {
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

  getDate(incrementBy = 0) {
    let dd: string;
    let mm: string;
    let yyyy: string;
    const today = new Date();
    if (incrementBy === 0) {
      dd = today.getDate().toString();
      mm = (today.getMonth() + 1).toString();
      yyyy = today.getFullYear().toString();
    } else {
      const incrementalDate = new Date();
      incrementalDate.setDate(incrementalDate.getDate() + incrementBy);
      dd = incrementalDate.getDate().toString();
      mm = (incrementalDate.getMonth() + 1).toString();
      yyyy = incrementalDate.getFullYear().toString();
    }
    return [dd, mm, yyyy];
  },

  /**
   * Checks if element is present or not on page
   * 
   * @param identifierType Type of Identifier
   * @param identifierValue Identifier Value to search
   * 
   * @returns Either True or False
   */
  async waitForElementToBeVisible(identifierType: string, identifierValue: string, verifyText = false) {
    let webElement: TcElementImpl;
    let count = 0;

    while (true) {
      try {
        if (count > appconfig.Timeout.PageLoad) {
          logger.info(`CountValue: ${count} Timeout: ${appconfig.Timeout.PageLoad}`)
          break;
        }
        switch (identifierType.toLowerCase()) {
          case 'xpath': webElement = ElementHelper.getElementByXPath(identifierValue); break;
        }
        const isElementDisplayed = await webElement.isDisplayed();
        const isElementEnabled = await webElement.isEnabled();
        const text = (await webElement.getText()).trim();
        let textVerification = true;
        if (verifyText) {
          textVerification = text.length !== 0 ? true : false;
        }
        if (isElementDisplayed && isElementEnabled && textVerification) {
          logger.info(`Element found and is visible ${identifierValue} in ${count} tries`)
          break;
        }
      } catch (error) {
        logger.debug('Element Not found Yet.')
      } finally {
        await BrowserHelper.sleep(100);
        count++;
      }
    }
    return webElement;
  },

  /**
   * Get Alert Message And Close Popup
   * 
   * @returns   Alert Message
   */
  async getAlertMessageAndClosePopup() {
    await this.waitForElementToBeVisible('xpath', alertBoxXpath, true);
    const message = await this.getAlertBox.getText();
    try {
      await ElementHelper.getElementByXPath(closeIconXpath).click();
    } catch (Error) { logger.info("Popup already closed.") }

    await BrowserHelper.sleep(500);
    return message;
  },

  /**
   * Matches element text from the list of elements and clicks on that element
   * 
   * @param list    List of Elements
   * @param value   Value to match with element text
   */
  async searchTextFromListAndClick(list: any, value: string, clickUsingActions = false) {
    const isClicked = false;
    const size = list.length
    for (let index = 0; index < size; index++) {
      await list[index].getText().then(async (text: string) => {
        if (text === value) {
          if (clickUsingActions) {
            browser.actions().mouseMove(list[index]).sendKeys(protractor.Key.ENTER).perform();
          } else {
            list[index].click();
          }
          await BrowserHelper.sleep(1000);
          logger.info(`Clicked on ${value}`);
        }
      })
      if (isClicked) {
        break;
      }
    }
  },

  async waitForProjectsToGetLoaded() {
    await this.waitForElementToBeVisible('xpath', projectTableXpath, true);
  },

  async waitForCustomerProjects() {
    await this.waitForElementToBeVisible('xpath', customerProjectsXpath, true);
  },

  async waitForListToGetLoaded(identifierType: string, identifierValue: string, listSize = 1) {
    let webElementsList: any;
    let count = 0;

    while (true) {
      try {
        switch (identifierType.toLowerCase()) {
          case 'xpath': webElementsList = await ElementHelper.getAllElementsByXPath(identifierValue); break;
        }
        const size = await webElementsList.length;
        if (size > listSize) {
          break;
        }
      } catch (error) {
        continue;
      }
      if (count > appconfig.Timeout.PageLoad) {
        break;
      }
      await BrowserHelper.sleep(100);
      count++;
    }
  },

  async listenersCleanup() {
    logger.info(`Running ${this.listenersCleanup.name} ...`);
    const exitListeners = process.listeners("exit");
    const exitListenersFn = exitListeners.map((f) => f.toString());

    exitListeners.forEach((listener: any, index: number) => {
      if (exitListenersFn.indexOf(listener.toString()) !== index) {
        process.removeListener('exit', listener);
      }
    });
    logger.info(`\tDone!`);
  },

  /**
   * Wait for milestone page loads
   */
  async waitForMilestones() {
    await this.waitForElementToBeVisible('xpath', milestoneXpath, true);
  },

  /**
   * Wait for add new milestones button loads
   */
  async waitForAddNewMilestones() {
    await this.waitForElementToBeVisible('xpath', addNewMilestonesXpath, true);
  },

  /**
   * Get All Projects Table
   */
   allProjectsTable() {
    return ElementHelper.getElementByXPath('//div[@class="flex-area"] | //div[contains(@class, "card-view")]');
  }
};

