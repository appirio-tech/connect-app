/**
 * Milestone type 'delivery`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import moment from 'moment'

import ProjectProgress from '../../../ProjectProgress'
import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'
import MilestonePostMessage from '../../MilestonePostMessage'
import MilestonePostEditText from '../../MilestonePostEditText'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypeDelivery.scss'

/*
  Acceptance dialogue messages based on the milestone type
*/
const acceptDialogue = {
  'delivery-dev': {
    title: 'Code acceptance',
    text: 'Do you need any refinement on winner’s code before we deliver you the final source files? Some refinement or final fixes outside the project scope may cost you additional payment',
    button: 'Accept code',
  },
  'delivery-design': {
    title: 'Design acceptance',
    text: 'Do you need any refinement on winner’s design before we deliver you the final source files? Some refinement or final fixes outside the project scope may cost you additional payment',
    button: 'Accept design',
  },
  // TODO this is a temporary fallback for already created milestones in DEV backend
  // this is just to keep already created milestones working and can be removed when we don't touch such projects anymore
  delivery: {
    title: 'Work acceptance',
    text: 'Do you need any refinement on winner’s work before we deliver you the final source files? Some refinement or final fixes outside the project scope may cost you additional payment',
    button: 'Accept work',
  },
}

class MilestoneTypeDelivery extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowFinalFixesRequestForm: false,
      finalFixRequests: [],
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.showFinalFixesRequestForm = this.showFinalFixesRequestForm.bind(this)
    this.hideFinalFixesRequestForm = this.hideFinalFixesRequestForm.bind(this)
    this.acceptDesign = this.acceptDesign.bind(this)
    this.onFinalFixAdd = this.onFinalFixAdd.bind(this)
    this.onFinalFixRemove = this.onFinalFixRemove.bind(this)
    this.submitFinalFixesRequest = this.submitFinalFixesRequest.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
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

  /**update link */
  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    values.type = 'zip'
    values.isDownloadable = true

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
    const { isShowFinalFixesRequestForm, finalFixRequests } = this.state

    const links = _.get(milestone, 'details.content.links', [])
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
              (currentUser.isCopilot || currentUser.isManager) &&
              !currentUser.isAdmin &&
              !isFinalFixesSubmitted &&
              (
                <DotIndicator>
                  <div styleName="top-space">
                    <MilestonePostMessage
                      label="Design acceptance"
                      backgroundColor={'#CEE6FF'}
                      message="The customer has yet to respond to the final deliverable acceptance. Please communicate with them if there’s a problem and they need help to make the final decision. Once they respond you’ll see a link to upload the final deliverables here."
                      isShowSelection={false}
                      buttons={[]}
                    />
                  </div>
                </DotIndicator>
              )
            }
            {
              !isAccepted &&
              !isDeclined &&
              !isShowFinalFixesRequestForm &&
              (currentUser.isCustomer || currentUser.isAdmin) &&
              !isFinalFixesSubmitted &&
            (
              <DotIndicator>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label={acceptDialogue[milestone.type].title}
                    backgroundColor={'#FFF4F4'}
                    message={acceptDialogue[milestone.type].text}
                    isShowSelection={false}
                    buttons={[
                      { title: 'Request fixes', onClick: this.showFinalFixesRequestForm, type: 'default' },
                      { title: acceptDialogue[milestone.type].button, onClick: this.acceptDesign, type: 'primary' },
                    ]}
                  />
                </div>
              </DotIndicator>
            )}

            {isShowFinalFixesRequestForm && !isFinalFixesSubmitted && (
              <div>
                {finalFixRequests.map((finalFixRequest, index) => (
                  <div styleName="top-space" key={index}>
                    <MilestonePostEditText
                      index={index}
                      value={finalFixRequest.value}
                      onRemove={this.onFinalFixRemove}
                      isAutoExpand
                    />
                  </div>
                ))}
                <div styleName="top-space">
                  <MilestonePostEditText
                    onAdd={this.onFinalFixAdd}
                    isAutoExpand
                  />
                </div>
                <DotIndicator>
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
                </DotIndicator>
              </div>
            )}

            {(isFinalFixesSubmitted || isAccepted) && (
              <div>
                <DotIndicator>
                  <div styleName="top-space">
                    <ProjectProgress
                      labelDayStatus={progressText}
                      progressPercent={progressPercent}
                      theme={daysLeft < 0 ? 'warning' : 'light'}
                    />
                  </div>
                </DotIndicator>

                {!currentUser.isCustomer && (
                  <DotIndicator hideLine>
                    <LinkList
                      links={links}
                      onAddLink={this.updatedUrl}
                      onRemoveLink={this.removeUrl}
                      onUpdateLink={this.updatedUrl}
                      fields={[{ name: 'url'}]}
                      addButtonTitle="Add link"
                      formAddTitle="Adding a link"
                      formAddButtonTitle="Add a link"
                      formUpdateTitle="Editing a link"
                      formUpdateButtonTitle="Save changes"
                      isUpdating={milestone.isUpdating}
                      canAddLink
                    />

                    <div styleName="top-space">
                      <div styleName="button-layer">
                        <button
                          className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                          onClick={this.completeMilestone}
                          disabled={links.length === 0}
                        >
                          Mark as completed
                        </button>
                      </div>
                    </div>
                  </DotIndicator>
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
            <LinkList links={links} />
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
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
}

export default MilestoneTypeDelivery
