/**
 * Milestone type 'final-fix`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import moment from 'moment'

import ProjectProgress from '../../../ProjectProgress'
import MilestonePostEditText from '../../MilestonePostEditText'
import DotIndicator from '../../DotIndicator'
import MilestoneDescription from '../../MilestoneDescription'
import LinkList from '../../LinkList'
import { withMilestoneExtensionRequest } from '../../MilestoneExtensionRequest'

import { MILESTONE_STATUS  } from '../../../../../../config/constants'

import './MilestoneTypeFinalFixes.scss'

class MilestoneTypeFinalFixes extends React.Component {
  constructor(props) {
    super(props)

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
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

  getDescription() {
    const { milestone } = this.props

    return milestone[`${milestone.status}Text`]
  }

  completeMilestone() {
    const { completeFinalFixesMilestone } = this.props

    completeFinalFixesMilestone()
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
    const finalFixRequests = _.get(milestone, 'details.content.finalFixRequests', [])
    const links = _.get(milestone, 'details.content.links', [])
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0)

    const startDate = moment(milestone.actualStartDate || milestone.startDate)
    const endDate = moment(milestone.startDate).add(milestone.duration - 1, 'days')
    const daysLeft = endDate.diff(today, 'days')
    const totalDays = endDate.diff(startDate, 'days')

    const progressText = daysLeft > 0
      ? `${daysLeft} days until final fixes completed`
      : `${-daysLeft} days final fixes are delayed`

    const progressPercent = daysLeft > 0
      ? (totalDays - daysLeft) / totalDays * 100
      : 100

    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideDot>
          <MilestoneDescription description={this.getDescription()} />
        </DotIndicator>

        {isActive && (
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
          </div>
        )}

        {finalFixRequests.map((finalFixRequest, index) => (
          <DotIndicator hideLine key={index}>
            <div styleName="top-space">
              <MilestonePostEditText
                value={finalFixRequest.value}
              />
            </div>
          </DotIndicator>
        ))}

        {isActive && !currentUser.isCustomer && (
          <DotIndicator hideLine>
            <LinkList
              links={links}
              onAddLink={this.updatedUrl}
              onRemoveLink={this.removeUrl}
              onUpdateLink={this.updatedUrl}
              fields={[{ name: 'url'}]}
              addButtonTitle="Add deliverable"
              formAddTitle="Adding final deliverable"
              formAddButtonTitle="Add deliverable"
              formUpdateTitle="Editing a deliverable"
              formUpdateButtonTitle="Save changes"
              isUpdating={milestone.isUpdating}
              canAddLink
            />
          </DotIndicator>
        )}

        {isActive && !!extensionRequestDialog && (
          <DotIndicator hideLine>
            <div styleName="top-space">
              {extensionRequestDialog}
            </div>
          </DotIndicator>
        )}

        {isActive && !!extensionRequestConfirmation && (
          <DotIndicator hideLine>
            <div styleName="top-space">
              {extensionRequestConfirmation}
            </div>
          </DotIndicator>
        )}

        {
          isActive &&
          !extensionRequestDialog &&
          !currentUser.isCustomer &&
        (
          <DotIndicator hideLine>
            <div styleName="top-space">
              <div styleName="button-layer">
                <button
                  className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                  onClick={this.completeMilestone}
                  disabled={links.length === 0}
                >
                  Mark as completed
                </button>
                {extensionRequestButton}
              </div>
            </div>
          </DotIndicator>
        )}
      </div>
    )
  }
}

MilestoneTypeFinalFixes.defaultProps = {
  theme: null,
}

MilestoneTypeFinalFixes.propTypes = {
  completeFinalFixesMilestone: PT.func.isRequired,
  theme: PT.string,
  milestone: PT.object.isRequired,
  updateMilestoneContent: PT.func.isRequired,
  extensionRequestDialog: PT.node,
  extensionRequestButton: PT.node,
  extensionRequestConfirmation: PT.node,
}

export default withMilestoneExtensionRequest(MilestoneTypeFinalFixes)
