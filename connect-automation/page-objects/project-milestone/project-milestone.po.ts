import { BrowserHelper, ElementHelper } from 'topcoder-testing-lib';
import { logger } from '../../logger/logger';
import { ConfigHelper } from '../../utils/config-helper';

export class ProjectMilestonePageObject {

	/**
	 * Get Content Wrapper Element
	 */
	public get contentWrapper() {
		return ElementHelper.getElementByClassName("twoColsLayout-contentInner");
	}

	/**
	 * Get Dashboard Page
	 */
	public get dashboardPageLoad() {
		return ElementHelper.getElementByXPath('//div[contains(@class, "twoColsLayout-contentInner")]');
	}

	/**
	 * Get Milestone Page Title
	 */
	public get milestonesPageTitle() {
		return ElementHelper.getElementByXPath('//div[contains(@class,"twoColsLayout-contentInner")]//li/span');
	}

	/**
	 * Get Milestone Name textbox
	 */
	public get milestoneNameTextbox() {
		return ElementHelper.getElementByXPath('//input[contains(@name, "title-")]');
	}

	/**
	 * Get Milestone Description Textbox
	 */
	public get milestoneDescriptionTextbox() {
		return ElementHelper.getElementByXPath('//textarea[contains(@name, "description-")]');
	}

	/**
	 * Get Milestone Table Rows
	 */
	public get milestoneTableRows() {
		return ElementHelper.getAllElementsByXPath('//tbody/tr');
	}

	/**
	 * Get Popup Message
	 */
	public get popupMessage() {
		return ElementHelper.getElementByXPath('//div[contains(@style, "position: absolute;")]');
	}

	/**
	 * Get Yes button
	 */
	public get yesButton() {
		return ElementHelper.getElementByXPath('(//div[contains(@style, "position: absolute;")]//button)[1]');
	}

	/**
	 * Get Management Window Title
	 */
	public get copilotManagementWindowTitle() {
		return ElementHelper.getElementByXPath(this.copilotManagementWindowTitleXpath);
	}

	/**
	 * Get Copilot Dropdown
	 */
	public get copilotDropdown() {
		return ElementHelper.getElementByXPath('//div[@class="right-sidebar-container"]//div[contains(@class, "react-select__control")]');
	}

	/**
	 * Get Copilot Textbox
	 */
	public get copilotTextbox() {
		return ElementHelper.getElementByXPath('//input[@type="text" and @style]');
	}

	/**
	 * Get Copilot Name Label
	 */
	public get copilotNameLabel() {
		return ElementHelper.getElementByXPath('(//div[@class="Avatar"]/following-sibling::div/span)[1]');
	}

	/**
	 * Get Close Icon
	 */
	public get closeIcon() {
		return ElementHelper.getElementByXPath('//h2/button');
	}

	/**
	 * Get Action Row's first columns
	 */
	public async actionRow() {
		const els = await ElementHelper.getAllElementsByClassName('_2BPUCg');
		return els[0];
	}

	/**
	 * Get Save button
	 */
	public async saveButton() {
		const actionRow = await this.actionRow();
		return ElementHelper.getElementByCss("button[type='submit']", actionRow);
	}

	/**
	 * Get Milestone SelectAll Checkbox
	 */
	public get milestoneSelectAllCheckbox() {
		return ElementHelper.getElementByXPath('//label[@for="select-all" and not (@class)]');
	}

	/**
	 * Get Project Selected Label
	 */
	public get projectSelectedLabel() {
		return ElementHelper.getElementByXPath('((//button[contains(@class,"tc-btn-primary tc-btn-sm")])[1]//preceding-sibling::div)[1]');
	}

	/**
	 * Get Add Copilot Button
	 */
	public get addCopilotButton() {
		return ElementHelper.getElementByXPath('((//button[contains(@class,"tc-btn-primary tc-btn-sm")])[1]//preceding-sibling::div)[4]');
	}

	/**
	 * Get Copilot List
	 */
	public get copilotList() {
		return ElementHelper.getAllElementsByXPath('//div[contains(@class, "react-select__option")]');
	}

	/**
	 * Get Move Milestone Button
	 */
	public get moveMilestoneButton() {
		return ElementHelper.getElementByXPath('(//button[contains(@class,"tc-btn-primary tc-btn-sm")])[1]//preceding-sibling::span');
	}

	/**
	 * Get Move Milestone Popup Message
	 */
	public get moveMilestonePopupMessage() {
		return ElementHelper.getElementByXPath('//div[@data-placement="bottom-end"]');
	}

	/**
	 * Get Move Milestone Input box
	 */
	public get moveMilestoneInputBox() {
		return ElementHelper.getElementByXPath('//div[@data-placement="bottom-end"]//input');
	}

	/**
	 * Get Delete Milestone Button
	 */
	public get deleteMilestoneButton() {
		return ElementHelper.getElementByXPath('((//button[contains(@class,"tc-btn-primary tc-btn-sm")])[1]//preceding-sibling::div)[3]');
	}

	/**
	 * Get Milestone Start Date Text box
	 */
	public get milestoneStartDateTextbox() {
		return ElementHelper.getElementByXPath('//input[contains(@name, "startDate")]');
	}

	/**
	 * Get Milestone End Text box
	 */
	public get milestoneEndDateTextbox() {
		return ElementHelper.getElementByXPath('//input[contains(@name, "endDate")]');
	}

	/**
	 * Get Milestone Dropdown
	 */
	public get milestoneDropdown() {
		return ElementHelper.getElementByXPath('//div[contains(@class,"react-select-hiddendropdown-container")]');
	}

	/**
	 * Get Milestone List
	 */
	public get milestoneList() {
		return ElementHelper.getAllElementsByXPath('//div[contains(@class, "react-select__option")]');
	}

	public milestoneListXpath = '//div[contains(@class , "react-select__menu-list")]';
	public addNewMilestoneXpath = '(//button[contains(@class,"tc-btn-primary tc-btn-sm")])[INDEX]';
	public copilotImageXpath = `//td[contains(text(), "MILESTONE_NAME")]//ancestor::tr//img`;
	public copilotManagementWindowTitleXpath = '//div[@class="right-sidebar-container"]//h2';
	public milestoneStatusXpath = '//td[text()="MILESTONE_NAME"]//following-sibling::td/span';
	public actionButtonForCustomerXpath = "//span[.= 'In Review']/parent::td/following-sibling::td//button[contains(@class, '#')]" // assumes action buttons are available for customers for milestone in review status.

	/**
	 * Get Add Copilot Button
	 *
	 * @param milestoneName 	Milestone Name for the copilot button
	 */
	public getAddCopilotButton(milestoneName: string) {
		return ElementHelper.getElementByXPath(`//input[contains(@value, "${milestoneName}")]//ancestor::tr//button[contains(@class, "tc-btn-default")]`);
	}

	/**
	 * Get Move Milestone Button
	 *
	 * @param index 	Index of the button
	 */
	public getMoveMilestoneButton(index = 1) {
		return ElementHelper.getElementByXPath(`(//div[@data-placement="bottom-end"]//button)[${index}]`);
	}

	/**
	 * Get Add Button
	 *
	 * @param index Index of the Add Button (In Case more than one button is present)
	 */
	public getAddButton(index = 1) {
		return ElementHelper.getElementByXPath(this.addNewMilestoneXpath.replace("INDEX", index + ""));
	}

	/**
	 * Get Edit Button
	 *
	 * @param milestoneName 	Edit Button for Milestone
	 */
	public getEditButton(milestoneName: string) {
		return ElementHelper.getElementByXPath(`(//td[text()="${milestoneName}"]/parent::tr//button[@type="button"])[1]`);
	}

	/**
	 * Get Delete Button
	 *
	 * @param milestoneName 	Delete button for Milestone
	 */
	public getDeleteButton(milestoneName: string) {
		return ElementHelper.getElementByXPath(`(//td[text()="${milestoneName}"]/parent::tr//button[@type="button"])[2]`);
	}

	/**
	 * Get Copilot Image
	 * @param milestoneName 	Copilot Image for Milestone
	 * @returns
	 */
	public getCopilotImage(milestoneName: string) {
		return ElementHelper.getElementByXPath(this.copilotImageXpath.replace('MILESTONE_NAME', milestoneName));
	}

	/**
	 * Get Milestone Status
	 *
	 * @param milestoneName 	State for the Milestone
	 */
	public getMilestoneStatus(milestoneName: string) {
		return ElementHelper.getElementByXPath(this.milestoneStatusXpath);
	}

	/**
	 * @returns Set of all milestone approve/reject buttons
	 */
	public getAllMilestoneActionButtonsForCustomer(actionRequired: string) {
		const actionIndex = (actionRequired === 'approve' ? 'WMNL' : '_2xf0_H')
		return ElementHelper.getAllElementsByXPath(this.actionButtonForCustomerXpath.replace('#', actionIndex))
	}

	/**
	 * @returns milestone approve/reject buttons
	 */
	public getMilestoneActionButtonForCustomer(actionRequired: string) {
		const actionIndex = (actionRequired === 'approve' ? 'WMNL' : '_2xf0_H')
		return ElementHelper.getElementByXPath(this.actionButtonForCustomerXpath.replace('#', actionIndex))
	}

	/**
	 * @returns all milestone approved notification.
	 */
	public allMilestoneApproveNotification() {
		return ElementHelper.getElementByXPath("//div[@class='_309UjB']")
	}

	/**
	 * Get project title
	 */
	public get projectTitle() {
		return ElementHelper.getElementByClassName("project-card")
	}

	/**
	 * @returns **dismiss button** for all milestone approved notification
	 */
	public getDismissAllMilestoneApprovedNotificationButton() {
		return ElementHelper.getElementByXPath("//button/div[.='DISMISS']")
	}
}