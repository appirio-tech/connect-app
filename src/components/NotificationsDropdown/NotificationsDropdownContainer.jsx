/**
 * Container component for NotificationsDropdown component
 *
 * Connects to the state and prepare data for dummy component
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getNotifications, markAllNotificationsRead, toggleNotificationRead } from '../../routes/notifications/actions'
import { splitNotificationsBySources, filterReadNotifications, limitQuantityInSources } from '../../routes/notifications/helpers/notifications'
import NotificationsSection from '../NotificationsSection/NotificationsSection'
import NotificationsEmpty from '../NotificationsEmpty/NotificationsEmpty'
import NotificationsDropdownHeader from  '../NotificationsDropdownHeader/NotificationsDropdownHeader'
import NotificationsDropdown from  './NotificationsDropdown'
import { NOTIFCATIONS_DROPDOWN_PER_SOURCE, NOTIFCATIONS_DROPDOWN_MAX_TOTAL } from '../../config/constants'
import './NotificationsDropdown.scss'

class NotificationsDropdownContainer extends React.Component {

  componentDidMount() {
    this.props.getNotifications()
  }

  freezeBody(){
    document.body.classList.add('noScroll')
  }

  unfreezeBody(){
    document.body.classList.remove('noScroll')
  }

  render() {
    if (!this.props.initialized) {
      return null
    }
    const { sources, notifications, markAllNotificationsRead, toggleNotificationRead, pending } = this.props
    const notReadNotifications = filterReadNotifications(notifications)
    const notificationsBySources = limitQuantityInSources(
      splitNotificationsBySources(sources, notReadNotifications),
      NOTIFCATIONS_DROPDOWN_PER_SOURCE,
      NOTIFCATIONS_DROPDOWN_MAX_TOTAL
    )
    const globalSource = notificationsBySources.length > 0 && notificationsBySources[0].id === 'global' ? notificationsBySources[0] : null
    const projectSources = notificationsBySources.length > 1 && globalSource ? notificationsBySources.slice(1) : notificationsBySources
    const hasUnread = notReadNotifications.length > 0
    // we have to give Dropdown component some time
    // before removing notification item node from the list
    // otherwise dropdown thinks we clicked outside and closes dropdown
    const toggleNotificationReadWithDelay = (notificationId) => {
      if (!pending) {
        setTimeout(() => toggleNotificationRead(notificationId), 0)
      }
    }

    return (
      <NotificationsDropdown hasUnread={hasUnread}>
        <NotificationsDropdownHeader onMarkAllClick={() => !pending && markAllNotificationsRead()} hasUnread={hasUnread} />
        {!hasUnread ? (
          <div className="notifications-dropdown-body">
            <NotificationsEmpty>
              <div className="notification-settings">
                <Link to="/settings/notifications" className="tc-btn tc-btn-secondary">Notification Settings</Link>
              </div>
            </NotificationsEmpty>
          </div>
        ) : ([
          <div key="body"
              className="notifications-dropdown-body"
                onMouseEnter={this.freezeBody}
                onMouseLeave={this.unfreezeBody}>
            {globalSource && globalSource.notifications.length &&
              <NotificationsSection
                {...globalSource}
                isGlobal
                isSimple
                onReadToggleClick={toggleNotificationReadWithDelay}
              />
            }
            {projectSources.filter(source => source.notifications.length > 0).map(source =>
              <NotificationsSection
                {...source}
                key={source.id}
                isSimple
                onReadToggleClick={toggleNotificationReadWithDelay}
              />
            )}
          </div>,
          <Link key="footer" to="/notifications" className="notifications-read-all tc-btn-link">Read all notifications</Link>
        ])}
      </NotificationsDropdown>
    )
  }
}

const mapStateToProps = ({ notifications }) => notifications

const mapDispatchToProps = {
  getNotifications,
  markAllNotificationsRead,
  toggleNotificationRead
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsDropdownContainer)
