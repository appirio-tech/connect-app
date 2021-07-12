import { BrowserHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../../common-page/common.helper';
import { IAnswers, IProjectData } from './create-project.model';
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
    // await BrowserHelper.sleep(5000);
  }

  /**
   * Verifies user can create design, development & deployment project
   * @param projectData Project Creation Form Data
   */
  public static async verifyProjectCreation(projectData: IProjectData) {
    const appNameWithDate = CommonHelper.appendDate(projectData.appName);

    await this.clickNewProjectButton();
    await this.navigateToViewSolutions();
    await this.clickOnDesignDevelopmentDeploymentButton();
    await this.fillBeforeWeStartForm(projectData.answers);
    await this.fillBasicDetailsForm(
      appNameWithDate,
      projectData.appDescription
    );
    await this.fillAppDefinitionForm(projectData);
    await this.saveProject();
    await this.goToYourProject(appNameWithDate);
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
   * Click on "Select" button under Design, Development and Deployment.
   */
  private static async clickOnDesignDevelopmentDeploymentButton() {
    const selectButton = await this.createProjectPageObject.selectButton();
    await selectButton.click();
    await this.verifyFormDisplayed('Before we start');
  }

  /**
   * Fill Before We Start form
   * @param answers answers object defined by test data
   */
  private static async fillBeforeWeStartForm(answers: IAnswers) {
    const { beforeWeStart } = answers;
    await CommonHelper.selectInputByContainingText(beforeWeStart);

    await this.createProjectPageObject.nextButton.click();

    await this.verifyFormDisplayed('Basic Details');
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
}
