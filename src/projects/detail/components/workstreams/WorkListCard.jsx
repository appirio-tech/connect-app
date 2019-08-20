/**
 * WorkListCard section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

import ChatIcon from '../../../../assets/icons/icon-chat-pastel-crimson.svg'
import {
  PHASE_STATUS,
  MILESTONE_TYPE,
} from '../../../../config/constants'

import './WorkListCard.scss'

const WorkListCard = ({
  workstream,
  work,
  match,
  inputDesignWorks,
  startDesignReview,
  timeline,
  activeMilestone,
}) => {
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
          onClick={() => startDesignReview(timeline.id, activeMilestone.id)}
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
    <Link to={`/projects/${match.params.projectId}/workstreams/${workstream.id}/works/${work.id}`} styleName="container">
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
  startDesignReview: PT.func.isRequired,
  timeline: PT.object.isRequired,
  activeMilestone: PT.object,
}

export default withRouter(WorkListCard)
