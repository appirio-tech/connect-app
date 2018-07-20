import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import moment from 'moment'

import DotIndicator from '../../DotIndicator'
import ProjectProgress from '../../../ProjectProgress'
import Form from '../../Form'
import LinkRow from '../../LinkRow'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypeProgress.scss'

class MilestoneTypeProgress extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingLink: false
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
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

    values.type = 'only-text'

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
    const { isAddingLink } = this.state

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

MilestoneTypeProgress.defaultProps = {
  theme: null,
}

MilestoneTypeProgress.propTypes = {
  theme: PT.string,
  milestone: PT.object.isRequired,
}

export default MilestoneTypeProgress
