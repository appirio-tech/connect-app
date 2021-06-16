import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../../logger/logger';
import { ConfigHelper } from '../../../utils/config-helper';
import { CommonHelper } from '../../common-page/common.helper';

export class CreateProjectPageObject {
  /**
   * Open the Home page
   */
  public static async open() {
    await BrowserHelper.open(ConfigHelper.getHomePageUrl());
    logger.info('User navigated to Home Page');
  }

  /**
   * Get New Project Button
   */
  public get newProjectButton() {
    return ElementHelper.getElementByLinkText('+ New Project');
  }

  /**
   * Get New Project Page Title Elements
   */
  public get newProjectPageTitles() {
    return ElementHelper.getAllElementsByClassName('_1vZbtq');
  }

  /**
   * Get View Solutions button from Create Project Page
   */
  public get viewSolutions() {
    return ElementHelper.getElementByButtonText('View Solutions');
  }

  /**
   * Get Solution Catalog Page's title element
   */
  public get solutionCatalogTitle() {
    const parentEl = ElementHelper.getElementByClassName(
      'SelectProjectTemplate'
    );
    return ElementHelper.getElementByTag('h1', parentEl);
  }

  /**
   * Get Select Button
   */
  public async selectButton() {
    const selectButtons = await ElementHelper.getAllElementsByButtonText(
      'Select'
    );
    return selectButtons[0];
  }

  /**
   * Get Your Project Button
   */
  public get yourProjectButton() {
    return ElementHelper.getElementContainingText('Go to Project');
  }

  /**
   * Get Next Button
   */
  public get nextButton() {
    return ElementHelper.getElementByButtonText('Next');
  }

  /**
   * Get Save My Project button
   */
  public get saveMyProject() {
    return ElementHelper.getElementByButtonText('Save my project');
  }

  /**
   * Get Current Form Page's title element
   */
  public get formPageTitle() {
    const parentEl = ElementHelper.getElementByClassName('YAZHbL');
    return ElementHelper.getElementByTag('h3', parentEl);
  }

  /**
   * Get Project Header Summary
   */
  public get headerSummary() {
    const parentEl = ElementHelper.getElementByClassName('form-header-summary');
    return ElementHelper.getElementByTag('h2', parentEl);
  }

  /**
   * Get App Name Input
   */
  public get appNameInput() {
    return ElementHelper.getElementByName('name');
  }

  /**
   * Get App Description Input
   */
  public get appDescriptionInput() {
    return ElementHelper.getElementByName('description');
  }

  /**
   * Get Draft Project title
   */
  public get draftProject() {
    return ElementHelper.getElementByClassName('IncompleteProjectConfirmation');
  }

  /**
   * Get Create new Project button
   */
  public get createNewProject() {
    return ElementHelper.getElementByButtonText('Create a new project');
  }

  /**
   * Get Notes input field
   */
  public get notesInput() {
    return ElementHelper.getElementByName('details.apiDefinition.notes');
  }

  /**
   * Get sub title
   */
  public get subTitle() {
    return ElementHelper.getElementContainingText(
      'Your project has been created'
    );
  }

  /**
   * Wait for subtitle to show
   */
  public async waitForSubTitle() {
    await CommonHelper.waitUntilVisibilityOf(
      () => this.subTitle,
      'Wait for success message',
      true
    );
    logger.info('Success Message Displayed');
  }
}
