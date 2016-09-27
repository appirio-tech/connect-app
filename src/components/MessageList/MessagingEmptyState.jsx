import React from 'react'
import './MessagingEmptyState.scss'
import Panel from '../Panel/Panel'
import ActionCard from '../ActionCard/ActionCard'
import Comment from '../ActionCard/Comment'
import { Icons } from 'appirio-tech-react-components'

const MessagingEmptyState = ({ currentUser, onClose }) => (
  <Panel className="panel-orange action-card messaging-empty-state">
    <div className="empty-state-content">
      <a href="javascript:" className="btn-action btn-close" onClick={onClose}>
        <Icons.CloseIcon />
      </a>
      <Comment
        avatarUrl={ require('../../assets/images/avatar-coder.png') }
        authorName="Code the Bot"
        self={false}
        date=""
      >
        Hey {currentUser.firstName}, welcome to the messages section. This is where you can keep communication open and ongoing during the project. You can create new messages from the top left, using the + button. Have in mind that all messages are visible to all team members.
      </Comment>
    </div>
  </Panel>
)

export default MessagingEmptyState
