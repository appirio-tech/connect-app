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
   * Get Tap Into Top Talent button from Create Project Page
   */
  public get tapIntoTopTalent() {
    return ElementHelper.getElementByButtonText('Tap Into Top Talent');
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
   * Get Submit Job Request button
   */
  public get submitJobRequest() {
    return ElementHelper.getElementByButtonText('Submit job request');
  }

  /**
   * Get view Talent Request button
   */
  public get viewTalentRequestButton() {
    return ElementHelper.getElementByCss('.go-to-project-dashboard-btn');
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
   * Get job title element
   */
  public get titleInput() {
    return ElementHelper.getElementByName('title');
  }

  /**
   * Get email input element
   */
  public get emailInput() {
    return ElementHelper.getElementByName('details.taasDefinition.hiringManager');
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
   * Get plus icon
   */
  public get plusIcon() {
    return ElementHelper.getElementByClassName('ZALPRV');
  }

  /**
   * Get delete icon
   */
  public get deleteIcon() {
    return ElementHelper.getElementByCss('.ZALPRV._1SfKng');
  }

  /**
   * Get taas job form
   */
  public async taasJobForm() {
    return ElementHelper.getAllElementsByClassName('_3mAtc-');
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
   * Get number input elements
   */
  public async numberInputEls() {
    const els = await ElementHelper.getAllElementsByCss('.tc-file-field__inputs.trlMaU');
    return els;
  }

  /**
   * Get dropdown elements
   */
  public async dropdownEls() {
    const els = await ElementHelper.getAllElementsByCss('.dropdown-wrap.SelectDropdown.default');
    return els;
  }

  /**
   * Get dropdown options
   */
  public async dropdownOptions() {
    const els = await ElementHelper.getAllElementsByClassName('dropdown-menu-list-item');
    return els;
  }

  /**
   * Get editor textarea
   */
  public get editorTextarea() {
    return ElementHelper.getElementByClassName('te-editor-section');
  }

  /**
   * Get editor textarea input
   */
  public get editorTextareaInput() {
    return ElementHelper.getElementByCss('.tui-editor-contents.tui-editor-contents-placeholder');
  }

  /**
   * Get skills input
   */
  public get skillsInput() {
    return ElementHelper.getElementByCss('.css-1hwfws3.react-select__value-container.react-select__value-container--is-multi');
  }

  /**
   * Get multi select option
   */
  public get multiSelectOption() {
    return ElementHelper.getElementByCss('.css-fk865s-option.react-select__option');
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
