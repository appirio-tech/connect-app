import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import moment from 'moment'

import ProjectProgress from '../../../ProjectProgress'
import Form from '../../Form'
import LinkRow from '../../LinkRow'
import MilestonePostMessage from '../../MilestonePostMessage'
import MilestonePostEditText from '../../MilestonePostEditText'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypeDelivery.scss'

class MilestoneTypeDelivery extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingLink: false,
      isShowFinalFixesRequestForm: false,
      finalFixRequests: [],
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.moveToReviewingState = this.moveToReviewingState.bind(this)
    this.showFinalFixesRequestForm = this.showFinalFixesRequestForm.bind(this)
    this.hideFinalFixesRequestForm = this.hideFinalFixesRequestForm.bind(this)
    this.acceptDesign = this.acceptDesign.bind(this)
    this.onFinalFixAdd = this.onFinalFixAdd.bind(this)
    this.onFinalFixRemove = this.onFinalFixRemove.bind(this)
    this.submitFinalFixesRequest = this.submitFinalFixesRequest.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
  }

  moveToReviewingState() {
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      isInReview: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { milestone } = this.props
    const { isAddingLink } = this.state

    if (
      isAddingLink && milestone.isUpdating &&
      !nextProps.milestone.isUpdating && !nextProps.error
    ) {
      this.closeEditForm()
    }
  }

  /**add link to this */
  openEditForm() {
    this.setState({isAddingLink: true})
  }

  /**close edit ui */
  closeEditForm() {
    this.setState({ isAddingLink: false })
  }

  /**update link */
  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    values.type = 'download'

    if (typeof linkIndex === 'number') {
      links.splice(linkIndex, 1, values)
    } else {
      links.push(values)
    }

    updateMilestoneContent({
      links
    })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }

    const { milestone, updateMilestoneContent } = this.props
    const links = [..._.get(milestone, 'details.content.links', [])]

    links.splice(linkIndex, 1)

    updateMilestoneContent({
      links
    })
  }

  showFinalFixesRequestForm() {
    this.setState({
      isShowFinalFixesRequestForm: true,
    })
  }

  hideFinalFixesRequestForm() {
    this.setState({
      isShowFinalFixesRequestForm: false,
    })
  }

  acceptDesign() {
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      isAccepted: true,
      isDeclined: false,
    })
  }

  onFinalFixAdd(value) {
    const { finalFixRequests } = this.state

    this.setState({
      finalFixRequests: [...finalFixRequests, {
        value,
      }]
    })
  }

  onFinalFixRemove(index) {
    const { finalFixRequests } = this.state

    const newFinalFixRequests = [...finalFixRequests]
    newFinalFixRequests.splice(index, 1)

    this.setState({
      finalFixRequests: newFinalFixRequests
    })
  }

  submitFinalFixesRequest() {
    const { submitFinalFixesRequest } = this.props
    const { finalFixRequests } = this.state

    submitFinalFixesRequest(finalFixRequests)
  }

  completeMilestone() {
    const { completeMilestone } = this.props

    completeMilestone()
  }

  render() {
    const { milestone, theme, currentUser } = this.props
    const { isAddingLink, isShowFinalFixesRequestForm, finalFixRequests } = this.state

    const links = _.get(milestone, 'details.content.links', [])
    const isInReview = _.get(milestone, 'details.content.isInReview', false)
    const isAccepted = _.get(milestone, 'details.content.isAccepted', false)
    const isDeclined = _.get(milestone, 'details.content.isDeclined', false)
    const isFinalFixesSubmitted = _.get(milestone, 'details.content.isFinalFixesSubmitted', false)
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    const endDate = moment(milestone.endDate)
    const startDate = moment(milestone.startDate)
    const daysLeft = endDate.diff(moment(), 'days')
    const totalDays = endDate.diff(startDate, 'days')

    let progressText

    if (isFinalFixesSubmitted) {
      progressText = daysLeft > 0
        ? `${daysLeft} days until final fixes completed`
        : `${-daysLeft} days final fixes are delayed`
    } else {
      progressText = daysLeft > 0
        ? `${daysLeft} days until delivery archive is ready`
        : `${-daysLeft} days delivery archive is delayed`
    }

    const progressPercent = daysLeft > 0
      ? (totalDays - daysLeft) / totalDays * 100
      : 100

    return (
      <div styleName={cn('milestone-post', theme)}>
        {/*
          Active status
         */}
        {isActive && (
          <div>
            {
              !isAccepted &&
              !isDeclined &&
              !isShowFinalFixesRequestForm &&
              (currentUser.isCustomer || currentUser.isAdmin) &&
              !isFinalFixesSubmitted &&
            (
              <div styleName="top-space">
                <MilestonePostMessage
                  label="Design acceptance"
                  backgroundColor={'#FFF4F4'}
                  message="Do you need any refinement on winner’s design before we deliver you the final source files? Some refinement or final fixes outside the projet scope may cost you additional payment"
                  isShowSelection={false}
                  buttons={[
                    { title: 'Request fixes', onClick: this.showFinalFixesRequestForm, type: 'default' },
                    { title: 'Accept design', onClick: this.acceptDesign, type: 'primary' },
                  ]}
                />
              </div>
            )}

            {isShowFinalFixesRequestForm && !isFinalFixesSubmitted && (
              <div styleName="top-space">
                {finalFixRequests.map((finalFixRequest, index) => (
                  <MilestonePostEditText
                    key={index}
                    index={index}
                    value={finalFixRequest.value}
                    onRemove={this.onFinalFixRemove}
                    isAutoExpand
                  />
                ))}
                <MilestonePostEditText
                  onAdd={this.onFinalFixAdd}
                  isAutoExpand
                />
                <div styleName="top-space button-add-layer">
                  <button
                    className="tc-btn tc-btn-default tc-btn-sm action-btn"
                    onClick={this.hideFinalFixesRequestForm}
                  >
                    Cancel
                  </button>
                  <button
                    className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                    onClick={this.submitFinalFixesRequest}
                    disabled={finalFixRequests.length === 0}
                  >
                    Submit request
                  </button>
                </div>
              </div>
            )}

            {(isFinalFixesSubmitted || isAccepted) && (
              <div>
                {!isInReview && (
                  <div styleName="top-space">
                    <ProjectProgress
                      labelDayStatus={progressText}
                      progressPercent={progressPercent}
                      theme={daysLeft < 0 ? 'warning' : 'light'}
                    />
                  </div>
                )}

                {!currentUser.isCustomer && !isInReview && (
                  <div>
                    {links.map((link, index) => (
                      <div styleName="top-space" key={index}>
                        <LinkRow
                          itemId={index}
                          milestonePostLink={link.url}
                          milestoneType={link.type}
                          deletePost={this.removeUrl}
                          updatePost={this.updatedUrl}
                        />
                      </div>
                    ))}

                    {isAddingLink && (
                      <div styleName="top-space">
                        <Form
                          callbackCancel={this.closeEditForm}
                          defaultValues={{ url: '' }}
                          callbackOK={this.updatedUrl}
                          label="Adding a link"
                          okButtonTitle="Add link"
                        />
                      </div>
                    )}

                    {!isAddingLink && (
                      <div styleName="top-space button-add-layer">
                        <button
                          className="tc-btn tc-btn-default tc-btn-sm action-btn"
                          onClick={this.openEditForm}
                        >
                          Add a link
                        </button>
                      </div>
                    )}

                    {!currentUser.isCustomer && (
                      <div styleName="top-space button-layer">
                        <button
                          className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                          onClick={this.completeMilestone}
                          disabled={links.length === 0}
                        >
                          Mark as completed
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/*
          Completed status
         */}
        {isCompleted && (
          <div>
            {links.map((link, index) => (
              <div styleName="top-space" key={index}>
                <LinkRow
                  milestonePostLink={link.url}
                  milestoneType={link.type}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

MilestoneTypeDelivery.defaultProps = {
  theme: null,
}

MilestoneTypeDelivery.propTypes = {
  theme: PT.string,
  milestone: PT.object.isRequired,
}

export default MilestoneTypeDelivery
