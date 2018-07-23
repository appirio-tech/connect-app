import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import moment from 'moment'

import DotIndicator from '../../DotIndicator'
import ProjectProgress from '../../../ProjectProgress'
import LinkList from '../../LinkList'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypeProgress.scss'

class MilestoneTypeProgress extends React.Component {
  constructor(props) {
    super(props)

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
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
    const { milestone, theme, currentUser } = this.props

    const links = _.get(milestone, 'details.content.links', [])
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    const endDate = moment(milestone.endDate)
    const startDate = moment(milestone.startDate)
    const daysLeft = endDate.diff(moment(), 'days')
    const totalDays = endDate.diff(startDate, 'days')

    const progressText = daysLeft > 0
      ? `${daysLeft} days until the job is completed`
      : `${-daysLeft} days job is delayed`

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
            <div styleName="top-space">
              <DotIndicator hideDot={!currentUser.isCustomer}>
                <ProjectProgress
                  labelDayStatus={progressText}
                  progressPercent={progressPercent}
                  theme={daysLeft < 0 ? 'warning' : 'light'}
                />
              </DotIndicator>
            </div>

            {!currentUser.isCustomer && (
              <div>
                <LinkList
                  links={links}
                  onAddLink={this.updatedUrl}
                  onRemoveLink={this.removeUrl}
                  onUpdateLink={this.updatedUrl}
                  fields={[{ name: 'title'}, { name: 'url'}, { name: 'type' }]}
                  addButtonTitle="Add link"
                  formAddTitle="Adding a link"
                  formAddButtonTitle="Add a link"
                  formUpdateTitle="Editing a link"
                  formUpdateButtonTitle="Save changes"
                  isUpdating={milestone.isUpdating}
                  canAddLink
                />

                <div styleName="top-space">
                  <DotIndicator>
                    <div styleName="top-space button-layer">
                      <button
                        className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                        onClick={this.completeMilestone}
                      >
                        Mark as completed
                      </button>
                    </div>
                  </DotIndicator>
                </div>
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

MilestoneTypeProgress.defaultProps = {
  theme: null,
}

MilestoneTypeProgress.propTypes = {
  theme: PT.string,
  milestone: PT.object.isRequired,
}

export default MilestoneTypeProgress
