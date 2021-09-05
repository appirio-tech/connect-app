import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../logger/logger';
import { ConfigHelper } from '../../../utils/config-helper';
import { CommonHelper } from '../../common-page/common.helper';

export class ProjectsPageObject {

  /**
   * Get Search Input
   */
  public get searchInput() {
    return ElementHelper.getElementByClassName('search-bar__text');
  }

  /**
   * Get Search Button
   */
  public get searchButton() {
    return ElementHelper.getElementByClassName('search-icon-wrap');
  }

  /**
   * Get Clear Button
   */
  public get clearButton() {
    return ElementHelper.getElementByClassName('search-bar__clear');
  }

  /**
   * Get Project Dashboard Element
   */
  public get projectDashboard() {
    const parentEl = ElementHelper.getElementByClassName('WtXOeL _3rjDL1');
    return ElementHelper.getElementContainingText('Dashboard', parentEl);
  }

  /**
   * Get first member's element
   */
  public get firstMember() {
    return ElementHelper.getElementByXPath('(//div[@class="members"])[1]');
  }

  /**
   * Get back to dashboard button
   */
  public get backButton() {
    return ElementHelper.getElementByClassName('_3Ielx-');
  }

  /**
   * Get ref containing element
   */
  public get refText() {
    return ElementHelper.getElementByXPath('(//span[@class="txt-gray-md"])[1]');
  }

  public get loadMoreNoMoreLabel() {
    return ElementHelper.getElementByXPath(this.loadMoreNoMoreLabelXpath);
  }

  /**
   * Open the Home page
   */
  public static async open() {
    await BrowserHelper.open(ConfigHelper.getHomePageUrl());
    logger.info('User navigated to Home Page');
  }
  public loadMoreNoMoreLabelXpath = '//div[@class="gridview-load-more"]/button | //div[@class="gridview-no-more"]';

  /**
   * Get All Projects By Title
   */
  public async projectTitles() {
    return ElementHelper.getAllElementsByClassName('link-title');
  }

  /**
   * Fill search bar with desired input
   * @param inputText input text
   */
  public async fillSearchBar(inputText: string) {
    const searchInput = this.searchInput;
    await CommonHelper.fillInputField(searchInput, inputText);
    await this.searchButton.click();

    await BrowserHelper.sleep(2000);
  }

  /**
   * Get Tab Element
   * @param tabName tab name
   */
  public async tabElement(tabName: string) {
    const parentEl = ElementHelper.getElementByClassName('_3M4SZg');
    return ElementHelper.getElementByCssContainingText(
      'li._2ZbGEn',
      tabName,
      parentEl
    );
  }

  /**
   * Get Active Tab Element
   */
  public async activeTab() {
    const tabNames = ElementHelper.getAllElementsByClassName('_2ZbGEn E7SY3s');
    return tabNames[0];
  }
}
