import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import moment from 'moment'

import ProjectProgress from '../../../ProjectProgress'
import SubmissionEditLink from '../../SubmissionEditLink'
import MilestonePost from '../../MilestonePost'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypeProgress.scss'

class MilestoneTypeProgress extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { milestone } = this.props
    const { isEditing } = this.state

    if (
      isEditing && milestone.isUpdating &&
      !nextProps.milestone.isUpdating && !nextProps.error
    ) {
      this.closeEditForm()
    }
  }

  /**add link to this */
  openEditForm() {
    this.setState({isEditing: true})
  }

  /**close edit ui */
  closeEditForm() {
    this.setState({ isEditing: false })
  }

  /**update link */
  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestone } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    if (typeof linkIndex === 'number') {
      links.splice(linkIndex, 1, values.url)
    } else {
      links.push(values.url)
    }

    updateMilestone(milestone.id, {
      details: {
        content: {
          links
        }
      }
    })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }

    const { milestone, updateMilestone } = this.props
    const links = [..._.get(milestone, 'details.content.links', [])]

    links.splice(linkIndex, 1)

    updateMilestone(milestone.id, {
      details: {
        content: {
          links
        }
      }
    })
  }

  completeMilestone() {
    const { milestone, completeMilestone } = this.props

    completeMilestone(milestone.id)
  }

  render() {
    const { milestone, theme } = this.props

    const links = _.get(milestone, 'details.content.links', [])
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE

    const endDate = moment(milestone.endDate)
    const startDate = moment(milestone.startDate)
    const daysLeft = endDate.diff(moment(), 'days')
    const totalDays = endDate.diff(startDate, 'days')
    const isTimeFinished = daysLeft <= 0

    const progressText = daysLeft > 0
      ? `${daysLeft} days until the job is completed`
      : 'Job is completed'

    const progressPercent = daysLeft > 0
      ? (totalDays - daysLeft) / totalDays * 100
      : 100

    return (
      <div
        styleName={cn('milestone-post', {
          [theme]: !!theme,
        })}
      >
        {isActive && (
          <div styleName="top-space">
            <ProjectProgress
              labelDayStatus={progressText}
              progressPercent={progressPercent}
              theme="light"
            />
          </div>
        )}

        {links.map((link, index) => (
          <MilestonePost
            key={index}
            itemId={index}
            milestonePostLink={link}
            milestoneType="only-text"
            deletePost={this.removeUrl}
            updatePost={this.updatedUrl}
            isUpdating={milestone.isUpdating}
            isActive={isActive}
          />
        ))}

        {this.state.isEditing && (
          <div styleName="top-space">
            <SubmissionEditLink
              callbackCancel={this.closeEditForm}
              defaultValues={{ url: '' }}
              callbackOK={this.updatedUrl}
              label="Adding a link"
              okButtonTitle="Add link"
            />
          </div>)
        }

        {isTimeFinished && isActive && !this.state.isEditing && (
          <div styleName="top-space button-add-layer">
            <button
              className="tc-btn tc-btn-default tc-btn-sm action-btn"
              onClick={this.openEditForm}
            >
              Add a link
            </button>
          </div>)
        }

        {isTimeFinished && isActive && (
          <div styleName="top-space button-layer">
            <button
              className="tc-btn tc-btn-primary tc-btn-sm action-btn"
              onClick={this.completeMilestone}
            >
              Mark as completed
            </button>
          </div>)
        }
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
