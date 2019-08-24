/**
 * WorkListCard section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter, Link } from 'react-router-dom'

import ChatIcon from '../../../../assets/icons/icon-chat-pastel-crimson.svg'
import {
  PHASE_STATUS,
  MILESTONE_TYPE,
} from '../../../../config/constants'

import './WorkListCard.scss'

const WorkListCard = (props) => {
  const {
    workstream,
    work,
    match,
    inputDesignWorks,
    timeline,
    activeMilestone,
  } = props
  const workDashboardUrl = `/projects/${match.params.projectId}/workstreams/${workstream.id}/works/${work.id}`
  const renderActionButton = () => {
    if (!activeMilestone) {
      return null
    }

    switch (activeMilestone.type) {
    case MILESTONE_TYPE.DESIGN_WORK:
      return (
        <button
          className="tc-btn tc-btn-primary tc-btn-sm"
          onClick={() => inputDesignWorks(timeline.id, activeMilestone.id)}
        >
            Input Designs
        </button>
      )
    case MILESTONE_TYPE.CHECKPOINT_REVIEW:
    case MILESTONE_TYPE.FINAL_DESIGNS:
      return (
        <button
          className="tc-btn tc-btn-primary tc-btn-sm"
          onClick={(e) => {
            e.preventDefault()
            // Start design review for timeline
            props.history.push(`${workDashboardUrl}/timelines/${timeline.id}/milestones/${activeMilestone.id}/review`)
          }}
        >
          Design Review
        </button>
      )
    default:
      return null
    }
  }
  const actionButton = renderActionButton()

  return (
    <Link to={workDashboardUrl} styleName="container">
      <div styleName="left">
        <div styleName="title-container">
          <span styleName="title">{work.name}</span>
          <span styleName="status">{_.find(PHASE_STATUS, ['value', work.status]).name}</span>
        </div>
        <span styleName="description">{work.description}</span>
      </div>
      <div styleName="right">
        <div styleName="icon-wrapper">
          <ChatIcon />
          {/* Show the random value of unread messages */}
          <span styleName="message-counter">45</span>
        </div>
        {!!actionButton && <div styleName="action">{actionButton}</div>}
      </div>
    </Link>
  )
}

WorkListCard.propTypes = {
  work: PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
    status: PT.string.isRequired,
    description: PT.string,
  }).isRequired,
  workstream: PT.shape({
    id: PT.number.isRequired,
  }).isRequired,
  inputDesignWorks: PT.func.isRequired,
  timeline: PT.object.isRequired,
  activeMilestone: PT.object,
}

export default withRouter(WorkListCard)
