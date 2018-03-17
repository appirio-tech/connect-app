import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import ActionCard from '../ActionCard/ActionCard'
import Panel from '../Panel/Panel'
import UserTooltip from '../User/UserTooltip'
import { NOTIFICATIONS } from '../../routes/notifications/constants/notifications'
import RemoveNotification from '../../assets/icons/x-mark-blue.svg'
import { toggleNotificationRead } from '../../routes/notifications/actions'

class SystemFeed extends React.Component {
  constructor(props) {
    super(props)
    this.onDelete = this.onDelete.bind(this)

  }

  onDelete() {
    if (this.props.onNotificationsRead) {
      this.props.onNotificationsRead(this.props.messages)
    }
  }

  render() {
    const {
      messages, user, onNotificationsRead
    } = this.props
    const message = messages[messages.length - 1]
    let authorName = user.firstName
    if (authorName && user.lastName) {
      authorName += ' ' + user.lastName
    }

    return (
      <ActionCard>
          <Panel.Body>
            <div className="portrait" id={`feed-${message.id}`}>
              <UserTooltip usr={user} id={'CoderBot'} previewAvatar size={40} />
            </div>
            <div className="object topicBody">
              <div className="card-profile">
                <div className="card-author">
                  { authorName }
                </div>
                <div className="card-time">
                  <span>{moment(message.date).fromNow()}</span>
                </div>
                <div className="hide-project-notification">
                  <i className="icon-remove-notification" onClick={this.onDelete}><RemoveNotification /></i>
                </div>
              </div>
              <div className="card-body">
                <span dangerouslySetInnerHTML={{__html: message.text}} />
              </div>
            </div>
          </Panel.Body>
      </ActionCard>
    )
  }
}

SystemFeed.propTypes = {
  user: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  onNotificationsRead: PropTypes.func.isRequired
}

export default SystemFeed
