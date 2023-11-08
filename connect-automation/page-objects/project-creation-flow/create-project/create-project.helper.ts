import { BrowserHelper } from 'topcoder-testing-lib';
import { ConfigHelper } from '../../../utils/config-helper';
import { CommonHelper } from '../../common-page/common.helper';
import { IAnswers, IProjectData, ITaasData } from './create-project.model';
import { CreateProjectPageObject } from './create-project.po';

export class CreateProjectPageHelper {
  /**
   * Initialize Create Project page object
   */
  public static initialize() {
    this.createProjectPageObject = new CreateProjectPageObject();
  }

  /**
   * Open Home page
   */
  public static async open() {
    await CreateProjectPageObject.open();
    await CommonHelper.waitForPageDisplayed();
  }

  /**
   * Verifies user can create design, development & deployment project
   * @param projectData Project Creation Form Data
   */
  public static async verifyProjectCreation(projectData: IProjectData) {
    const appNameWithDate = CommonHelper.appendDate(projectData.appName);

    await this.clickNewProjectButton();
    await this.navigateToViewSolutions();
    await this.clickOnSelectButton();
    await this.fillBeforeWeStartForm(projectData.answers, 'Basic Details');
    await this.fillBasicDetailsForm(
      appNameWithDate,
      projectData.appDescription
    );
    await this.fillAppDefinitionForm(projectData);
    await this.saveProject();
    await this.goToYourProject(appNameWithDate);
  }

  /**
   * verify whether the current user can create a TAAS project
   */
   public static async verifyTaasProject(taasData: ITaasData) {
    await this.clickNewProjectButton();
    await this.navigateToTopTalent();
    await this.clickOnSelectButton();
    await this.fillBeforeWeStartForm(taasData.answers, 'Talent as a Service: Getting Started');
    await this.fillTaasProjectTitleForm(taasData.title);
    await this.verifyAddJobItem();
    await this.verifyDeleteJobItem();
    await this.fillJobForm(taasData);
    await this.fillTalentRequirementForm(taasData.answers, 'Your Talent Requirements');
    await this.fillRequirementForm(taasData.answers, taasData.email);

    await this.createProjectPageObject.submitJobRequest.click();
    const message = await CommonHelper.getAlertMessageAndClosePopup();
    expect(message).toContain(`PROJECT '${taasData.title.toUpperCase()}' CREATED`);
  }

  private static createProjectPageObject: CreateProjectPageObject;

  /**
   * Verify page is displayed correctly.
   * @param expectedTitle page's expected title
   */
  private static async verifyFormDisplayed(expectedTitle: string) {
    const pageTitle = await this.createProjectPageObject.formPageTitle.getText();
    expect(pageTitle).toBe(expectedTitle);
  }

  /**
   * Verify page header summary
   * @param expectedTitle page's expected title
   */
  private static async verifyHeaderSummary(expectedTitle: string) {
    const pageTitle = await this.createProjectPageObject.headerSummary.getText();
    expect(pageTitle).toBe(expectedTitle);
  }

  /**
   * If there is draft project exist, click on create new project button
   */
  private static async checkDraftProject() {
    const isDraftProject = await this.createProjectPageObject.draftProject.isPresent();

    if (isDraftProject) {
      await this.createProjectPageObject.createNewProject.click();
    }
  }

  /**
   * Verify new project page is displayed with two options /Talent as Service, Solutions/
   */
  private static async clickNewProjectButton() {
    await this.createProjectPageObject.newProjectButton.click();
    await CommonHelper.waitUntilVisibilityOf(
      () => this.createProjectPageObject.viewSolutions,
      'Wait for New Project Form',
      true
    );

    await this.checkDraftProject();

    const titles = await this.createProjectPageObject.newProjectPageTitles;

    expect(titles.length).toBe(2);
    expect(await titles[0].getText()).toBe('SOLUTIONS');
    expect(await titles[1].getText()).toBe('TALENT AS A SERVICE');
  }

  /**
   * Click on "View Solutions" under "SOLUTIONS" section
   */
  private static async navigateToViewSolutions() {
    await this.createProjectPageObject.viewSolutions.click();
    const title = await this.createProjectPageObject.solutionCatalogTitle.getText();
    expect(title).toBe('TOPCODER SOLUTIONS');
  }

  /**
   * Click on "Tap Into Top Talen" under "TAAS" section
   */
  private static async navigateToTopTalent() {
    await this.createProjectPageObject.tapIntoTopTalent.click();
    const title = await this.createProjectPageObject.solutionCatalogTitle.getText();
    expect(title).toBe('ENGAGE TALENT');
  }

  /**
   * Click on "Select" button under Design, Development and Deployment.
   */
  private static async clickOnSelectButton() {
    const selectButton = await this.createProjectPageObject.selectButton();
    await selectButton.click();
    await this.verifyFormDisplayed('Before we start');
  }

  /**
   * Fill Before We Start form
   * @param answers answers object defined by test data
   * @param formTitle form title to be expected
   */
  private static async fillBeforeWeStartForm(answers: IAnswers, formTitle: string) {
    const { beforeWeStart } = answers;
    await CommonHelper.selectInputByContainingText(beforeWeStart);

    await this.createProjectPageObject.nextButton.click();

    await this.verifyFormDisplayed(formTitle);
  }

  /**
   * Fill Before We Start form
   * @param answers answers object defined by test data
   * @param formTitle form title to be expected
   */
  private static async fillTalentRequirementForm(answers: IAnswers, formTitle: string) {
    const { startDate } = answers;
    await CommonHelper.selectInputByContainingText(startDate);

    await this.createProjectPageObject.nextButton.click();

    await this.verifyFormDisplayed(formTitle);
  }

  /**
   * Fill Basic Details Form, then click next
   * @param appName application name
   * @param appDescription app description
   */
  private static async fillBasicDetailsForm(appName: string, appDescription) {
    const name = this.createProjectPageObject.appNameInput;
    await CommonHelper.fillInputField(name, appName);
    const description = this.createProjectPageObject.appDescriptionInput;
    await CommonHelper.fillInputField(description, appDescription);

    await this.createProjectPageObject.nextButton.click();

    await this.verifyFormDisplayed('App Definition');
  }

  /**
   * Fill Taas Project title, then click next
   * @param title taas application title
   */
  private static async fillTaasProjectTitleForm(title: string) {
    const name = this.createProjectPageObject.appNameInput;
    await CommonHelper.fillInputField(name, title);
    await this.createProjectPageObject.nextButton.click();

    await this.verifyFormDisplayed('Your Talent Requirements');
  }

  /**
   * Fill Requirement Form, then click next
   * @param title taas application title
   * @param email
   */
  private static async fillRequirementForm(answers: IAnswers, email: string) {
    const { requirement } = answers;
    await CommonHelper.selectInputByContainingText(requirement);

    await this.createProjectPageObject.emailInput.click();
    await this.createProjectPageObject.emailInput.sendKeys(email);

    await this.createProjectPageObject.nextButton.click();
  }

  /**
   * Fill Taas Job Form
   * @param taasData
   */
  private static async fillJobForm(taasData: ITaasData) {
    const { jobTitle, numOfPeople, duration, description } = taasData;

    const titleEl = this.createProjectPageObject.titleInput;
    await CommonHelper.fillInputField(titleEl, jobTitle);

    const numberInputs = await this.createProjectPageObject.numberInputEls();
    await CommonHelper.fillInputField(numberInputs[0], numOfPeople + '');
    await CommonHelper.fillInputField(numberInputs[1], duration + '');

    const dropdownInputs = await this.createProjectPageObject.dropdownEls();
    await dropdownInputs[0].click();
    let dropdownOptions = await this.createProjectPageObject.dropdownOptions();
    await dropdownOptions[1].click();

    await dropdownInputs[1].click();
    dropdownOptions = await this.createProjectPageObject.dropdownOptions();
    await dropdownOptions[6].click();

    await this.createProjectPageObject.editorTextarea.click();
    await this.createProjectPageObject.editorTextareaInput.sendKeys(description);

    await this.createProjectPageObject.skillsInput.click();
    await CommonHelper.waitForListToGetLoaded('xpath', this.createProjectPageObject.multiSelectOptionClassName, 2);

    const elements = await this.createProjectPageObject.multiSelectOption;
    await elements[1].click();

    await this.createProjectPageObject.nextButton.click();

    await this.verifyFormDisplayed('Your Talent Requirements');
  }

  /**
   * Fill App Definition Form, then click next
   * @param projectData project data from test data
   */
  private static async fillAppDefinitionForm(projectData: IProjectData) {
    const {
      whatDoYouNeed,
      howManyScreens,
      willYourAppNeedMoreScreen,
      whereShouldAppWork,
      howShouldAppWorks,
    } = projectData.answers;
    await CommonHelper.selectInputByContainingText(whatDoYouNeed);
    await CommonHelper.selectInputByContainingText(willYourAppNeedMoreScreen);
    await CommonHelper.selectInputByContainingText(howManyScreens);
    await this.createProjectPageObject.nextButton.click();
    await this.verifyFormDisplayed('App Definition');

    await CommonHelper.selectInputByContainingText(whereShouldAppWork);
    await CommonHelper.selectInputByContainingText(howShouldAppWorks);
    await this.createProjectPageObject.nextButton.click();
    await this.verifyFormDisplayed('App Definition');

    await this.createProjectPageObject.nextButton.click();
    await this.verifyFormDisplayed('App Definition');

    const notesInput = this.createProjectPageObject.notesInput;
    await CommonHelper.fillInputField(notesInput, projectData.notes);
    await this.createProjectPageObject.nextButton.click();
    await this.createProjectPageObject.nextButton.click();
    await this.verifyHeaderSummary('Your Project Estimate');
  }

  /**
   * Save project and verify success message
   */
  private static async saveProject() {
    await this.createProjectPageObject.saveMyProject.click();

    await this.createProjectPageObject.waitForSubTitle();
  }

  /**
   * Navigate to Your Project page and verify recently created project
   * @param appName app name
   */
  private static async goToYourProject(appName: string) {
    await this.createProjectPageObject.yourProjectButton.click();

    await CommonHelper.waitForProjectTitle();

    expect(await CommonHelper.projectTitle().getText()).toBe(appName);
  }

  /**
   * Add job item and verify Add Job Item
   */
  private static async verifyAddJobItem() {
    await this.createProjectPageObject.plusIcon.click();
    const jobFormNumber = await this.createProjectPageObject.taasJobForm();
    expect(jobFormNumber.length).toBe(2);
  }

  /**
   * Delete job item and verify Deletion of Job Item
   */
  private static async verifyDeleteJobItem() {
    await this.createProjectPageObject.deleteIcon.click();
    const jobFormNumber = await this.createProjectPageObject.taasJobForm();
    expect(jobFormNumber.length).toBe(1);
  }
}
