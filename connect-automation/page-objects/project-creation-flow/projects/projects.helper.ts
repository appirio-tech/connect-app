import _ = require('lodash');
import { BrowserHelper } from 'topcoder-testing-lib';
import * as appconfig from '../../../config/app-config.json';
import { logger } from '../../../logger/logger';
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
    await CommonHelper.waitForProjectsToGetLoaded();
  }

  /**
   * Verify whether the Copilot can Join the project
   */
  public static async verifyCopilotProjectJoin() {
    // Go to Recently created project
    await CommonHelper.goToRecentlyCreatedProject();

    // Click on Join Project button
    await BrowserHelper.waitUntilClickableOf(
      CommonHelper.joinProjectButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
    await CommonHelper.joinProjectButton.click();

    // Verify Success Alert
    const message = await CommonHelper.getAlertMessageAndClosePopup();
    expect(message).toEqual(`YOU'VE SUCCESSFULLY JOINED THE PROJECT.`);
  }

  /**
   * Verify user can search for projects using project name, user handle, ref code
   * @param searchProject object for search
   */
  public static async verifyProjectSearch(searchProject: ISearchProject) {
    const allProjectsBeforeSearch = await this.projectsPageObject.projectTitles();
    const beforeSearchLength = allProjectsBeforeSearch.length;

    await CommonHelper.waitForProjectsToGetLoaded();

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
    await BrowserHelper.waitUntilClickableOf(
      this.projectsPageObject.clearButton,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );
    await this.clickCancelButton();
    await BrowserHelper.sleep(2000);

    await BrowserHelper.waitUntilClickableOf(
      this.projectsPageObject.loadMoreNoMoreLabel,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );

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
      const currentUrl = await this.waitForTabProjectsToLoad(currentTab, expectedLinkStatuses[index]);
      expect(currentUrl).toContain(expectedLinkStatuses[index]);
    });
  }

  private static projectsPageObject: ProjectsPageObject;

  private static async waitForTabProjectsToLoad(currentTab: string, linkToCheck: string) {
    let loopCount = 0;

    const activeTab = await this.projectsPageObject.tabElement(currentTab);
    await BrowserHelper.waitUntilClickableOf(
      this.projectsPageObject.loadMoreNoMoreLabel,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );

    const previousText = await this.projectsPageObject.loadMoreNoMoreLabel.getText();
    await activeTab.click();

    await BrowserHelper.waitUntilClickableOf(
      this.projectsPageObject.loadMoreNoMoreLabel,
      appconfig.Timeout.ElementClickable,
      appconfig.LoggerErrors.ElementClickable
    );

    while (true) {
      try {
        if (loopCount > appconfig.Timeout.ElementClickable) {
          break;
        }
        loopCount++;

        const currentText = await this.projectsPageObject.loadMoreNoMoreLabel.getText();
        const currentUrl = await BrowserHelper.getCurrentUrl();
        if (currentText !== previousText && currentUrl.includes(linkToCheck)) {
          break;
        } else if (currentText === previousText && currentUrl.includes(linkToCheck)) {
          break;
        }
      } catch {
        continue;
      }
    }
    return BrowserHelper.getCurrentUrl();
  }

  /**
   * Verify all projects
   * @param searchTerm search term
   */
  private static async verifyAllProjects(searchTerm: string) {
    try {
      let searchResultElements = await this.projectsPageObject.projectTitles();
      if(searchResultElements.length === 0) {
        throw new Error('No Projects Found To Verify.');
      }

      let cnt=0;
      for(const element of searchResultElements) {
        searchResultElements = await this.projectsPageObject.projectTitles();
        await BrowserHelper.waitUntilVisibilityOf(searchResultElements[cnt]);
        logger.info(`${await searchResultElements[cnt].getText()} is visible.`);
        cnt++;
      }
      searchResultElements.map(async (project) => {
        const projectName = await project.getText();
        logger.info(`ProjectName ${projectName} : SearchTerm ${searchTerm}`)
        expect(projectName.toLowerCase()).toContain(searchTerm);
      });
		} catch (e) {
			throw new Error('No Projects Found To Verify ' + e);
		}
  }

  /**
   * Verify projects with ref
   * @param searchTerm search term
   */
  private static async verifyProjectWithRef(searchTerm: string) {
    const ref = await this.projectsPageObject.refText.getText();
    expect(ref).toBe(searchTerm);
  }

  /**
   * Click on clear button
   */
  private static async clickCancelButton() {
    await this.projectsPageObject.clearButton.click();
  }

  /**
   * Verify project search results by handle
   * @param memberHandle member handle from test data
   */
  private static async verifyProjectSearchByHandle(memberHandle: string) {
    await BrowserHelper.sleep(5000);
    const firstProject = await CommonHelper.firstProject();
    await firstProject.click();
    await BrowserHelper.waitUntilVisibilityOf(this.projectsPageObject.firstMember);
    expect(await this.projectsPageObject.firstMember.getText()).toContain(
      memberHandle
    );
    await this.projectsPageObject.backButton.click();
  }
}
