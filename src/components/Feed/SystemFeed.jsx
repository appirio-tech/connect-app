import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import ActionCard from '../ActionCard/ActionCard'
import Panel from '../Panel/Panel'
import UserTooltip from '../User/UserTooltip'
import RemoveNotification from '../../assets/icons/x-mark-blue.svg'

import './SystemFeed.scss'

class SystemFeed extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      messages, user, onNotificationRead
    } = this.props
    let authorName = user.firstName
    if (authorName && user.lastName) {
      authorName += ' ' + user.lastName
    }
    const renderMessages = (msg, i) => {
      return (
        <div className="project-notification" key={`${msg.id}-${i}`}>
          <ActionCard>
            <Panel.Body>
              <div className="portrait" id={`feed-${msg.id}`}>
                <UserTooltip usr={user} id={'CoderBot'} previewAvatar size={40} />
              </div>
              <div className="object topicBody">
                <div className="card-profile">
                  <div className="card-author">
                    { authorName }
                  </div>
                  <div className="card-time">
                    <span>{moment(msg.date).fromNow()}</span>
                  </div>
                  <div className="hide-project-notification">
                    <i className="icon-remove-notification" onClick={() => onNotificationRead(msg)}><RemoveNotification /></i>
                  </div>
                </div>
                <div className="card-body">
                  <span dangerouslySetInnerHTML={{__html: msg.text}} />
                </div>
              </div>
            </Panel.Body>
          </ActionCard>
        </div>
      )
    }
    return (
      <div className="system-feed">
        { messages.map(renderMessages) }
      </div>
    )
  }
}

SystemFeed.propTypes = {
  user: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  onNotificationRead: PropTypes.func.isRequired
}

export default SystemFeed
