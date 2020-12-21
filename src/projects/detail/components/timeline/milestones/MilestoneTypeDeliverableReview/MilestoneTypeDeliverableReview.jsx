/**
 * Milestone type `deliverable-review`, `final-deliverable-review`, `deliverable-final-fixes`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'
import LinkItem from '../../LinkItem'
import LinkItemForm from '../../LinkItemForm'
import MilestoneDescription from '../../MilestoneDescription'
import { withMilestoneExtensionRequest } from '../../MilestoneExtensionRequest'
import { getMilestoneStatusText } from '../../../../../../helpers/milestoneHelper'

import {
  MILESTONE_STATUS
} from '../../../../../../config/constants'

import './MilestoneTypeDeliverableReview.scss'
import { hasPermission } from '../../../../../../helpers/permissions'
import { PERMISSIONS } from '../../../../../../config/permissions'

class MilestoneTypeDeliverableReview extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingDeliverableUpdate: false,
      isAddingFeedbackLink: false,
      deliverableUpdateText: '',
      feedbackLink: '',
      isAdddingFinalFixesRequest: false,
      finalFixesRequest: '',
    }

    this.onClickAddDeliverableReview = this.onClickAddDeliverableReview.bind(this)
    this.onClickAddFeedbackLink = this.onClickAddFeedbackLink.bind(this)
    this.onDeliverableUpdateTextChange = this.onDeliverableUpdateTextChange.bind(this)
    this.onClickSaveDeliverableUpdate = this.onClickSaveDeliverableUpdate.bind(this)
    this.onClickCancelAddDeliverableUpdate = this.onClickCancelAddDeliverableUpdate.bind(this)
    this.updatedSubmissionUrl = this.updatedSubmissionUrl.bind(this)
    this.removeSubmissionUrl = this.removeSubmissionUrl.bind(this)
    this.onSubmitFeedbackLink = this.onSubmitFeedbackLink.bind(this)
    this.onAddFeedbackLinkCancel = this.onAddFeedbackLinkCancel.bind(this)
    this.onDeleteFeedbackLink = this.onDeleteFeedbackLink.bind(this)
    this.onClickReviewComplete = this.onClickReviewComplete.bind(this)

    this.onClickRequestFixes = this.onClickRequestFixes.bind(this)
    this.onClickCancelFinalFixesRequest = this.onClickCancelFinalFixesRequest.bind(this)
    this.onClickSubmitRequest = this.onClickSubmitRequest.bind(this)
    this.onFinalFixesRequestTextChange = this.onFinalFixesRequestTextChange.bind(this)
  }

  onClickAddDeliverableReview() {
    const { milestone } = this.props

    this.setState({
      isAddingDeliverableUpdate: true,
      deliverableUpdateText: _.get(milestone, 'details.content.deliverableUpdate'),
    })
  }

  onClickAddFeedbackLink() {
    const { milestone } = this.props

    this.setState({
      isAddingFeedbackLink: true,
      feedbackLink: _.get(milestone, 'details.content.feedbackLink'),
    })
  }

  onAddFeedbackLinkCancel() {
    this.setState({
      isAddingFeedbackLink: false,
    })
  }

  onClickCancelAddDeliverableUpdate() {
    this.setState({
      isAddingDeliverableUpdate: false,
    })
  }

  onDeliverableUpdateTextChange(event) {
    this.setState({
      deliverableUpdateText: event.target.value,
    })
  }

  onClickSaveDeliverableUpdate() {
    const { deliverableUpdateText } = this.state
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({ deliverableUpdate: deliverableUpdateText })
  }

  updatedSubmissionUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const submissionLinks = [..._.get(milestone, 'details.content.submissionLinks', [])]

    values.type = 'marvelapp'

    if (typeof linkIndex === 'number') {
      submissionLinks.splice(linkIndex, 1, values)
    } else {
      submissionLinks.push(values)
    }

    updateMilestoneContent({
      submissionLinks
    })
  }

  removeSubmissionUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }

    const { milestone, updateMilestoneContent } = this.props
    const submissionLinks = [..._.get(milestone, 'details.content.submissionLinks', [])]

    submissionLinks.splice(linkIndex, 1)

    updateMilestoneContent({
      submissionLinks
    })
  }

  onDeleteFeedbackLink() {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }

    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      feedbackLink: '',
    })
  }

  onSubmitFeedbackLink({ url }) {
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      feedbackLink: url,
    })
  }

  onClickReviewComplete() {
    const { completeMilestone } = this.props

    completeMilestone()
  }

  onClickRequestFixes() {
    this.setState({
      isAdddingFinalFixesRequest: true,
    })
  }

  onClickCancelFinalFixesRequest() {
    this.setState({
      isAdddingFinalFixesRequest: false,
    })
  }

  onClickSubmitRequest() {
    const { submitDeliverableFinalFixesRequest } = this.props
    const { finalFixesRequest } = this.state

    submitDeliverableFinalFixesRequest(finalFixesRequest)
  }

  onFinalFixesRequestTextChange(event) {
    this.setState({
      finalFixesRequest: event.target.value,
    })
  }

  render() {
    const {
      milestone,
      theme,
    } = this.props
    const {
      isAddingDeliverableUpdate,
      isAddingFeedbackLink,
      deliverableUpdateText,
      feedbackLink,

      isAdddingFinalFixesRequest,
      finalFixesRequest,
    } = this.state

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE

    const canManage = hasPermission(PERMISSIONS.MANAGE_MILESTONE)
    const canAcceptFinalDelivery = hasPermission(PERMISSIONS.ACCEPT_MILESTONE_FINAL_DELIVERY)

    const milestoneDeliverableFinalFixesRequest = _.get(milestone, 'details.content.finalFixesRequest', '')
    const milestoneDeliverableUpdate = _.get(milestone, 'details.content.deliverableUpdate', '')
    const milestoneFeedbackLink = _.get(milestone, 'details.content.feedbackLink', '')
    const milestoneSubmissionLinks = _.get(milestone, 'details.content.submissionLinks', [])

    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideDot>
          <MilestoneDescription description={getMilestoneStatusText(milestone)} />
        </DotIndicator>

        <div>
          <div className="flex column middle" styleName="btns-container-vertical">

            {/* For milestone type of 'deliverable-final-fixes' specifically */}
            {milestone.type === 'deliverable-final-fixes' && (
              <div styleName="fullwidth">
                <div styleName="view-report-text">{milestoneDeliverableFinalFixesRequest}</div>
              </div>
            )}

            {/* Deliverable update */}
            {isAddingDeliverableUpdate ? (
              <div styleName="fullwidth">
                <textarea rows="10" className="tc-textarea" styleName="report-textarea" type="text" onChange={this.onDeliverableUpdateTextChange} value={deliverableUpdateText}/>
                <div className="flex center" styleName="btns-container">
                  <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickCancelAddDeliverableUpdate}>Cancel</button>
                  <button type="button" className="tc-btn tc-btn-primary" onClick={this.onClickSaveDeliverableUpdate}>Save changes</button>
                </div>
              </div>
            ) : (
              milestoneDeliverableUpdate && (
                <div styleName="fullwidth">
                  <div styleName="view-report-text">{milestoneDeliverableUpdate}</div>
                  {
                    canManage && (
                      <div className="flex center" styleName="btns-container">
                        <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickAddDeliverableReview}>Edit</button>
                      </div>
                    )
                  }
                </div>
              ) || (
                isActive && canManage && (
                  <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickAddDeliverableReview}>Add deliverable update</button>
                )
              )
            )}

            {/* Feedback link */}
            {milestone.type !== 'deliverable-final-fixes' && (
              isAddingFeedbackLink ? (
                <div styleName="fullwidth">
                  <LinkItemForm
                    fields={[{
                      name: 'url',
                      value: feedbackLink
                    }]}
                    onCancelClick={this.onAddFeedbackLinkCancel}
                    onSubmit={this.onSubmitFeedbackLink}
                    submitButtonTitle="Add link"
                    title="Add feedback link"
                  />
                </div>
              ) : (
                milestoneFeedbackLink && (
                  <div styleName="fullwidth">
                    <LinkItem
                      fields={[{
                        name: 'url',
                        value: milestoneFeedbackLink
                      }]}
                      link={{
                        title: 'Feedback link',
                        url: milestoneFeedbackLink,
                        type: 'document',
                      }}
                      formUpdateTitle="Add feedback link"
                      formUpdateButtonTitle="Save changes"
                      deleteLink={isActive && canManage && this.onDeleteFeedbackLink}
                      updateLink={canManage && this.onSubmitFeedbackLink}
                      isUpdating={milestone.isUpdating}
                    />
                  </div>
                ) || (
                  isActive && canManage && (
                    <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickAddFeedbackLink}>Add feedback link</button>
                  )
                )
              )
            )}

            {/* Submission link */}
            <div styleName="fullwidth">
              <LinkList
                links={milestoneSubmissionLinks}
                onAddLink={this.updatedSubmissionUrl}
                onRemoveLink={isActive && canManage && this.removeSubmissionUrl}
                onUpdateLink={canManage && this.updatedSubmissionUrl}
                fields={[{
                  name: 'title',
                  value: `Submission ${milestoneSubmissionLinks.length + 1}`,
                  maxLength: 64,
                }, {
                  name: 'url'
                }]}
                addButtonTitle="Add submission link"
                formAddTitle="Add submission link"
                formAddButtonTitle="Add link"
                formUpdateTitle="Editing a link"
                formUpdateButtonTitle="Save changes"
                isUpdating={milestone.isUpdating}
                fakeName={`Submission ${milestoneSubmissionLinks.length + 1}`}
                canAddLink={isActive && canManage}
              />
            </div>
          </div>

          {/* For milestone types other than 'final-deliverable-review' specifically */}
          {milestone.type !== 'final-deliverable-review' && (
            isActive && canAcceptFinalDelivery && (
              <div className="flex center" styleName="review-complete-btn-container">
                <button type="button" className="tc-btn tc-btn-primary" onClick={this.onClickReviewComplete} disabled={milestoneSubmissionLinks.length === 0}>Review Complete</button>
              </div>
            )
          )}

          {/* For milestone type of 'final-deliverable-review' specifically */}
          {milestone.type === 'final-deliverable-review' && (
            isActive && canAcceptFinalDelivery && (
              isAdddingFinalFixesRequest ? (
                <div styleName="fullwidth">
                  <textarea rows="10" className="tc-textarea" styleName="report-textarea" type="text" onChange={this.onFinalFixesRequestTextChange} value={finalFixesRequest}/>
                  <div className="flex center" styleName="btns-container">
                    <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickCancelFinalFixesRequest}>Cancel</button>
                    <button type="button" className="tc-btn tc-btn-primary" onClick={this.onClickSubmitRequest}>Submit Request</button>
                  </div>
                </div>
              ) : (
                <div className="flex center" styleName="review-complete-btn-container btns-container">
                  <button type="button" className="tc-btn tc-btn-primary" onClick={this.onClickReviewComplete} disabled={milestoneSubmissionLinks.length === 0}>Accept deliverables</button>
                  <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickRequestFixes} disabled={milestoneSubmissionLinks.length === 0}>Request fixes</button>
                </div>
              )
            )
          )}
        </div>

      </div>
    )
  }
}

MilestoneTypeDeliverableReview.defaultProps = {
  theme: null,
}

MilestoneTypeDeliverableReview.propTypes = {
  milestone: PT.object,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
  submitDeliverableFinalFixesRequest: PT.func.isRequired,
  completeMilestone: PT.func.isRequired,
}

export default withMilestoneExtensionRequest(MilestoneTypeDeliverableReview)
