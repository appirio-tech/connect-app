/**
 * Container component for NotificationsDropdown component
 *
 * Connects to the state and prepare data for dummy component
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getNotifications, visitNotifications, toggleNotificationSeen, markAllNotificationsRead, toggleNotificationRead, toggleBundledNotificationRead } from '../../routes/notifications/actions'
import { splitNotificationsBySources, filterReadNotifications, limitQuantityInSources } from '../../routes/notifications/helpers/notifications'
import NotificationsSection from '../NotificationsSection/NotificationsSection'
import NotificationsEmpty from '../NotificationsEmpty/NotificationsEmpty'
import NotificationsDropdownHeader from  '../NotificationsDropdownHeader/NotificationsDropdownHeader'
import NotificationsDropdown from  './NotificationsDropdown'
import NotificationsMobilePage from  './NotificationsMobilePage'
import ScrollLock from 'react-scroll-lock-component'
import MediaQuery from 'react-responsive'
import { NOTIFCATIONS_DROPDOWN_PER_SOURCE, NOTIFCATIONS_DROPDOWN_MAX_TOTAL, REFRESH_NOTIFICATIONS_INTERVAL } from '../../config/constants'
import './NotificationsDropdown.scss'

class NotificationsDropdownContainer extends React.Component {

  componentDidMount() {
    this.props.getNotifications()
    this.autoRefreshNotifications = setInterval(() => this.props.getNotifications(), REFRESH_NOTIFICATIONS_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.autoRefreshNotifications)
  }

  render() {
    if (!this.props.initialized) {
      return <NotificationsDropdown hasUnread={false} />
    }

    const {lastVisited, sources, notifications, markAllNotificationsRead, toggleNotificationRead, toggleNotificationSeen, pending, toggleBundledNotificationRead, visitNotifications } = this.props
    const getPathname = link => link.split(/[?#]/)[0].replace(/\/?$/, '')

    // mark notifications with url mathc current page's url as seen
    if (!pending) {
      const seenNotificationIds = notifications
        .filter(({ isRead, seen, goto = '' }) => !isRead && !seen && getPathname(goto) === getPathname(window.location.pathname))
        .map(({ id }) => id)
        .join('-')
      seenNotificationIds.length && setTimeout(() => toggleNotificationSeen(seenNotificationIds), 0)
    }

    const notReadNotifications = filterReadNotifications(notifications)
    const notificationsBySources = limitQuantityInSources(
      splitNotificationsBySources(sources, notReadNotifications),
      NOTIFCATIONS_DROPDOWN_PER_SOURCE,
      NOTIFCATIONS_DROPDOWN_MAX_TOTAL
    )
    const globalSource = notificationsBySources.length > 0 && notificationsBySources[0].id === 'global' ? notificationsBySources[0] : null
    const projectSources = notificationsBySources.length > 1 && globalSource ? notificationsBySources.slice(1) : notificationsBySources
    const hasUnread = notReadNotifications.length > 0
    const olderNotificationsCount = _.sumBy(projectSources, 'total') - _.sumBy(projectSources, 'notifications.length')
    // we have to give Dropdown component some time
    // before removing notification item node from the list
    // otherwise dropdown thinks we clicked outside and closes dropdown
    const toggleNotificationReadWithDelay = (notificationId) => {
      if (!pending) {
        const notification = _.find(notReadNotifications, { id: notificationId })
        setTimeout(() => {
          // if it's bundled notification, then toggle all notifications inside the bundle
          if (notification.bundledIds) {
            toggleBundledNotificationRead(notificationId, notification.bundledIds)
          } else {
            toggleNotificationRead(notificationId)
          }
        }, 0)
      }
    }
    const hasNew = hasUnread && lastVisited < _.maxBy(_.map(notifications, n => new Date(n.date)))

    return (
      <MediaQuery minWidth={768}>
        {(matches) => (matches ? (
          <NotificationsDropdown hasUnread={hasUnread} hasNew={hasNew} onToggle={visitNotifications}>
            <NotificationsDropdownHeader onMarkAllClick={() => !pending && markAllNotificationsRead()} hasUnread={hasUnread}/>
            {!hasUnread ? (
              <div className="notifications-dropdown-body">
                <NotificationsEmpty>
                  <div className="notification-settings">
                    <Link to="/settings/notifications" className="tc-btn tc-btn-secondary">Notification Settings</Link>
                  </div>
                </NotificationsEmpty>
              </div>
            ) : ([
              <ScrollLock key="body">
                <div className="notifications-dropdown-body">
                  {globalSource && globalSource.notifications.length &&
                    <NotificationsSection
                      {...globalSource}
                      isGlobal
                      isSimple
                      onReadToggleClick={document.body.classList.remove('noScroll'), toggleNotificationReadWithDelay}
                      onLinkClick={toggleNotificationSeen}
                    />
                  }
                  {projectSources.filter(source => source.notifications.length > 0).map(source => (
                    <NotificationsSection
                      {...source}
                      key={source.id}
                      isSimple
                      onReadToggleClick={document.body.classList.remove('noScroll'), toggleNotificationReadWithDelay}
                      onLinkClick={toggleNotificationSeen}
                    />
                  ))}
                </div>
              </ScrollLock>,
              <Link key="footer" to="/notifications" className="notifications-read-all tc-btn-link">
                {
                  olderNotificationsCount > 0 ?
                    `View ${olderNotificationsCount} older notification${olderNotificationsCount > 1 ? 's' : ''}` :
                    'View all notifications'
                }
              </Link>
            ])}
          </NotificationsDropdown>
        ) : (
          <NotificationsMobilePage hasUnread={hasUnread} hasNew={hasNew} onToggle={visitNotifications}>
            {!hasUnread ? (
              <NotificationsEmpty />
            ) : (
              <div>
                {globalSource && globalSource.notifications.length &&
                  <NotificationsSection
                    {...globalSource}
                    isGlobal
                    isSimple
                    onReadToggleClick={document.body.classList.remove('noScroll'), toggleNotificationReadWithDelay}
                    onLinkClick={toggleNotificationSeen}
                  />}
                {projectSources.filter(source => source.notifications.length > 0).map(source => (
                  <NotificationsSection
                    {...source}
                    key={source.id}
                    isSimple
                    onReadToggleClick={document.body.classList.remove('noScroll'), toggleNotificationReadWithDelay}
                    onLinkClick={toggleNotificationSeen}
                  />
                ))}
              </div>
            )}
          </NotificationsMobilePage>
        ))}
      </MediaQuery>
    )
  }
}

const mapStateToProps = ({ notifications }) => notifications

const mapDispatchToProps = {
  getNotifications,
  visitNotifications,
  toggleNotificationSeen,
  markAllNotificationsRead,
  toggleNotificationRead,
  toggleBundledNotificationRead
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsDropdownContainer)
