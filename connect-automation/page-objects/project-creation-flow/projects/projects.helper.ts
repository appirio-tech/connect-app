import _ = require('lodash');
import { BrowserHelper } from 'topcoder-testing-lib';
import { CommonHelper } from '../../common-page/common.helper';
import { ISearchProject } from './projects.model';
import { ProjectsPageObject } from './projects.po';

export class ProjectsHelper {
  /**
   * Initialize Projects page object
   */
  public static initialize() {
    this.projectsPageObject = new ProjectsPageObject();
  }

  /**
   * Opens the Create Project page
   */
  public static async open() {
    await ProjectsPageObject.open();
    await CommonHelper.waitForPageDisplayed();
    await BrowserHelper.sleep(4000);
  }

  /**
   * Verify whether the Copilot can Join the project
   */
  public static async verifyCopilotProjectJoin() {
    // Go to Recently created project
    await CommonHelper.goToRecentlyCreatedProject();
    await BrowserHelper.sleep(4000);

    // Click on Join Project button
    await this.projectsPageObject.joinProjectButton.click();
    const alertElement = CommonHelper.alertBox();
    await CommonHelper.waitForSuccessAlert(alertElement);

    // Verify Success Alert
    expect(await CommonHelper.successAlert().getText()).toBe(
      `YOU'VE SUCCESSFULLY JOINED THE PROJECT.`
    );
  }

  /**
   * Verify user can search for projects using project name, user handle, ref code
   * @param searchProject object for search
   */
  public static async verifyProjectSearch(searchProject: ISearchProject) {
    await BrowserHelper.sleep(8000);
    const allProjectsBeforeSearch = await this.projectsPageObject.projectTitles();
    const beforeSearchLength = allProjectsBeforeSearch.length;
    const firstProjectBeforeSearch = await allProjectsBeforeSearch[0].getText();

    // Search by project name
    await this.projectsPageObject.fillSearchBar(searchProject.searchByName);
    await this.verifyAllProjects(searchProject.searchByName);
    await this.clickCancelButton();

    // Search by Ref
    await this.projectsPageObject.fillSearchBar(searchProject.searchByRef);
    await this.verifyProjectWithRef(searchProject.searchByRef);

    // Click on Clear button
    await this.clickCancelButton();

    // Search by Handle
    await this.projectsPageObject.fillSearchBar(searchProject.searchByHandle);
    await this.verifyProjectSearchByHandle(searchProject.searchByHandle);
    await this.clickCancelButton();

    const allProjectsAfterSearch = await this.projectsPageObject.projectTitles();

    expect(beforeSearchLength).toEqual(allProjectsAfterSearch.length);

    expect(firstProjectBeforeSearch).toEqual(
      await allProjectsAfterSearch[0].getText()
    );
  }

  /**
   * verify user can switch between the Project tabs
   */
  public static async verifySwitchTabs() {
    const tabNames = [
      'Active',
      'In review',
      'Reviewed',
      'Completed',
      'Cancelled',
      'Paused',
      'All Projects',
    ];

    const expectedLinkStatuses = [
      'active',
      'in_review',
      'reviewed',
      'completed',
      'cancelled',
      'paused',
      '',
    ];

    tabNames.map(async (currentTab, index) => {
      await BrowserHelper.sleep(1000);
      const activeTab = await this.projectsPageObject.tabElement(currentTab);
      await activeTab.click();
      const currentUrl = await BrowserHelper.getCurrentUrl();
      expect(currentUrl).toContain(expectedLinkStatuses[index]);
    });
  }

  private static projectsPageObject: ProjectsPageObject;

  /**
   * Verify all projects
   * @param searchTerm search term
   */
  private static async verifyAllProjects(searchTerm: string) {
    const searchResultElements = await this.projectsPageObject.projectTitles();
    searchResultElements.map(async (project) => {
      const projectName = await project.getText();
      expect(projectName.toLowerCase()).toContain(searchTerm);
    });
    await BrowserHelper.sleep(1000);
  }

  /**
   * Verify projects with ref
   * @param searchTerm search term
   */
  private static async verifyProjectWithRef(searchTerm: string) {
    const ref = await this.projectsPageObject.refText.getText();
    expect(ref).toBe(searchTerm);

    await BrowserHelper.sleep(1000);
  }

  /**
   * Click on clear button
   */
  private static async clickCancelButton() {
    await this.projectsPageObject.clearButton.click();
    await BrowserHelper.sleep(1000);
  }

  /**
   * Verify project search results by handle
   * @param memberHandle member handle from test data
   */
  private static async verifyProjectSearchByHandle(memberHandle: string) {
    await CommonHelper.goToRecentlyCreatedProject();
    await BrowserHelper.waitUntilVisibilityOf(this.projectsPageObject.firstMember);
    expect(await this.projectsPageObject.firstMember.getText()).toBe(
      memberHandle
    );
    await this.projectsPageObject.backButton.click();
    await BrowserHelper.sleep(5000);
  }
}
