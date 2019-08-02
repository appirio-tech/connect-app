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


const WorkListCard = ({workstream, work, match}) => (
  <Link to={`/projects/${match.params.projectId}/workstreams/${workstream.id}/works/${work.id}`} styleName="container">
    <div styleName="left">
      <div styleName="title-container">
        <span styleName="title">{work.name}</span>
        <span styleName="status">{_.find(PHASE_STATUS, ['value', work.status]).name}</span>
      </div>
      <span styleName="description">{work.description}</span>
    </div>
    <div styleName="right">
      <ChatIcon />
      {/* Show the random value of unread messages */}
      <span styleName="message-counter">45</span>
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
}

export default withRouter(WorkListCard)
