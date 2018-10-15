/**
 * Milestone type 'community-work` and `community-review`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import ProjectProgress from '../../../ProjectProgress'
import LinkList from '../../LinkList'
import MilestoneDescription from '../../MilestoneDescription'
import { withMilestoneExtensionRequest } from '../../MilestoneExtensionRequest'

import { MILESTONE_STATUS } from '../../../../../../config/constants'
import { getMilestoneStatusText, getDaysLeft, getProgressPercent, getTotalDays } from '../../../../../../helpers/milestoneHelper'

import './MilestoneTypeProgress.scss'

class MilestoneTypeProgress extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showExtensionRequestSection: true,
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
    this.onFormAddOpen = this.onFormAddOpen.bind(this)
    this.onFormAddCancel = this.onFormAddCancel.bind(this)
  }

  onFormAddOpen() {
    this.setState({ showExtensionRequestSection: false });
  }

  onFormAddCancel() {
    this.setState({ showExtensionRequestSection: true });
  }

  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

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

  completeMilestone() {
    const { completeMilestone } = this.props

    completeMilestone()
  }

  render() {
    const {
      milestone,
      theme,
      currentUser,
      extensionRequestDialog,
      extensionRequestButton,
      extensionRequestConfirmation,
    } = this.props

    const links = _.get(milestone, 'details.content.links', [])
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    const daysLeft = getDaysLeft(milestone)
    const totalDays = getTotalDays(milestone)

    const progressText = daysLeft >= 0
      ? `${daysLeft} days until the job is completed`
      : `${-daysLeft} days job is delayed`

    const progressPercent = getProgressPercent(totalDays, daysLeft)
    const { showExtensionRequestSection } = this.state
    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideDot>
          <MilestoneDescription description={getMilestoneStatusText(milestone)} />
        </DotIndicator>

        {/*
          Active status
         */}
        {isActive && (
          <div>
            <div styleName="top-space">
              <DotIndicator hideDot={!currentUser.isCustomer || extensionRequestConfirmation}>
                <ProjectProgress
                  labelDayStatus={progressText}
                  progressPercent={progressPercent}
                  theme={daysLeft < 0 ? 'warning' : 'light'}
                />
              </DotIndicator>
            </div>

            {!currentUser.isCustomer && (
              <DotIndicator hideDot={showExtensionRequestSection}>
                <LinkList
                  links={links}
                  onAddLink={this.updatedUrl}
                  onRemoveLink={this.removeUrl}
                  onUpdateLink={this.updatedUrl}
                  fields={[{ name: 'title' }, { name: 'url' }, { name: 'type' }]}
                  addButtonTitle="Add link"
                  formAddTitle="Adding a link"
                  formAddButtonTitle="Add link"
                  formUpdateTitle="Editing a link"
                  formUpdateButtonTitle="Save changes"
                  isUpdating={milestone.isUpdating}
                  onFormAddOpen={this.onFormAddOpen}
                  onFormAddCancel={this.onFormAddCancel}
                  canAddLink
                />
              </DotIndicator>
            )}

            {!!extensionRequestDialog && (
              <DotIndicator>
                <div styleName="top-space">
                  {extensionRequestDialog}
                </div>
              </DotIndicator>
            )}

            {!!extensionRequestConfirmation && (
              <DotIndicator hideDot={!currentUser.isCustomer}>
                <div styleName="top-space">
                  {extensionRequestConfirmation}
                </div>
              </DotIndicator>
            )}

            {
              !currentUser.isCustomer &&
              !extensionRequestDialog && showExtensionRequestSection &&
              (
                <DotIndicator>
                  <div styleName="top-space">
                    <div styleName="top-space button-layer">
                      <button
                        className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                        onClick={this.completeMilestone}
                      >
                        Mark as completed
                      </button>
                      {!currentUser.isCustomer && extensionRequestButton}
                    </div>
                  </div>
                </DotIndicator>
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

MilestoneTypeProgress.defaultProps = {
  theme: null,
}

MilestoneTypeProgress.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
  extensionRequestDialog: PT.node,
  extensionRequestButton: PT.node,
  extensionRequestConfirmation: PT.node,
}

export default withMilestoneExtensionRequest(MilestoneTypeProgress)
