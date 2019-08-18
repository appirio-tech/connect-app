/**
 * WorkListCard section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

import ChatIcon from '../../../../assets/icons/icon-chat-pastel-crimson.svg'
import { PHASE_STATUS } from '../../../../config/constants'
import './WorkListCard.scss'


const WorkListCard = ({workstream, work, match, showInputReviewBtn, inputDesignWorks, timeline, milestone}) => (
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
      {
        showInputReviewBtn &&
        <button
          styleName="input-review-btn"
          className="tc-btn tc-btn-default tc-btn-sm"
          onClick={() => { inputDesignWorks(timeline.id, milestone.id) }}
        >Input Review</button>
      }
    </div>
  </Link>
)

WorkListCard.defaultProps = {
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
  showInputReviewBtn: PT.bool.isRequired,
  inputDesignWorks: PT.func.isRequired,
  timeline: PT.object.isRequired,
  milestone: PT.object.isRequired
}

export default withRouter(WorkListCard)
