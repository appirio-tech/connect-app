/**
 * Container component for NotificationsDropdown component
 *
 * Connects to the state and prepare data for dummy component
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import { getNotifications, visitNotifications, toggleNotificationSeen, markAllNotificationsRead,
  toggleNotificationRead, toggleBundledNotificationRead, viewOlderNotifications,
  toggleNotificationsDropdownMobile, hideOlderNotifications } from '../../routes/notifications/actions'
import { splitNotificationsBySources, filterReadNotifications, limitQuantityInSources } from '../../routes/notifications/helpers/notifications'
import NotificationsSection from '../NotificationsSection/NotificationsSection'
import NotificationsEmpty from '../NotificationsEmpty/NotificationsEmpty'
import NotificationsDropdownHeader from  '../NotificationsDropdownHeader/NotificationsDropdownHeader'
import NotificationsDropdown from  './NotificationsDropdown'
import NotificationsMobilePage from  './NotificationsMobilePage'
import NotificationsReadAll from './NotificationsReadAll'
import ScrollLock from 'react-scroll-lock-component'
import MediaQuery from 'react-responsive'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'
import { NOTIFICATIONS_DROPDOWN_PER_SOURCE, NOTIFICATIONS_NEW_PER_SOURCE, REFRESH_NOTIFICATIONS_INTERVAL, SCREEN_BREAKPOINT_MD } from '../../config/constants'
import './NotificationsDropdown.scss'

class NotificationsDropdownContainer extends React.Component {

  componentDidMount() {
    this.props.getNotifications()
    this.autoRefreshNotifications = setInterval(() => this.props.getNotifications(), REFRESH_NOTIFICATIONS_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.autoRefreshNotifications)
    // hide notifications dropdown for mobile, when this component is unmounted
    this.props.toggleNotificationsDropdownMobile(false)
    this.props.hideOlderNotifications()
  }

  componentWillReceiveProps(nextProps) {
    const currentPathname = this.props.location.pathname
    const nextPathname = nextProps.location.pathname

    if (currentPathname !== nextPathname) {
      // hide notifications dropdown for mobile,
      // when this component persist but URL changed
      this.props.toggleNotificationsDropdownMobile(false)
      this.props.hideOlderNotifications()
    }
  }

  render() {
    const {initialized, isLoading, lastVisited, sources, notifications, markAllNotificationsRead, toggleNotificationRead, toggleNotificationSeen,
      pending, toggleBundledNotificationRead, visitNotifications, oldSourceIds, viewOlderNotifications, isDropdownMobileOpen,
      toggleNotificationsDropdownMobile } = this.props
    if (!initialized && isLoading) {
      return (
        <NotificationsDropdown hasUnread={false}>
          <LoadingIndicator />
        </NotificationsDropdown>
      )
    }
    const getPathname = link => link.split(/[?#]/)[0].replace(/\/?$/, '')

    // mark notifications with url match current page's url as seen
    if (!pending) {
      const seenNotificationIds = notifications
        .filter(({ isRead, seen, goto = '' }) => !isRead && !seen && getPathname(goto) === getPathname(window.location.pathname))
        .map(({ id }) => id)
        .join('-')
      seenNotificationIds.length && setTimeout(() => toggleNotificationSeen(seenNotificationIds), 0)
    }

    const notReadNotifications = filterReadNotifications(notifications)
    const allNotificationsBySources = splitNotificationsBySources(sources, notReadNotifications)

    const hasUnread = notReadNotifications.length > 0
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
    let notificationsEmpty = (
      <NotificationsEmpty>
        <p className="notifications-empty-note">
          Maybe you need to check your <Link to="/settings/notifications" className="tc-link">notification settings</Link> to
          get up  to date with the latest activity from your projects?
        </p>
        <div className="notification-settings">
          <Link to="/settings/notifications" className="tc-btn tc-btn-default">Notification Settings</Link>
        </div>
      </NotificationsEmpty>
    )
    if (!isLoading && !initialized) {
      notificationsEmpty = (
        <NotificationsEmpty message="Fail to load notifications">
          <p className="notifications-empty-note">
            Maybe the notification server is not working or your device is offline.
          </p>
        </NotificationsEmpty>
      )
    }

    // this function checks that notification is not seen yet,
    // before marking it as seen
    const markNotificationSeen = (notificationId) => {
      const notification = _.find(notifications, { id: notificationId })

      if (notification && !notification.seen) {
        toggleNotificationSeen(notificationId)
      }
    }

    return (
      <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
        {(matches) => {
          if (matches) {
            const notificationsBySources = limitQuantityInSources(
              allNotificationsBySources,
              NOTIFICATIONS_DROPDOWN_PER_SOURCE,
              oldSourceIds
            )
            const hiddenByLimitCount = _.sumBy(notificationsBySources, 'total') - _.sumBy(notificationsBySources, 'notifications.length')
            const globalSource = notificationsBySources.length > 0 && notificationsBySources[0].id === 'global' ? notificationsBySources[0] : null
            const projectSources = notificationsBySources.length > 1 && globalSource ? notificationsBySources.slice(1) : notificationsBySources

            return (
              <NotificationsDropdown hasUnread={hasUnread} hasNew={hasNew} onToggle={visitNotifications}>
                <NotificationsDropdownHeader onMarkAllClick={() => !pending && markAllNotificationsRead()} hasUnread={hasUnread}/>
                {!hasUnread ? (
                  <div className="notifications-dropdown-body">
                    {notificationsEmpty}
                  </div>
                ) : ([
                  <ScrollLock key="body">
                    <div className="notifications-dropdown-body">
                      {globalSource && globalSource.notifications.length &&
                        <NotificationsSection
                          {...globalSource}
                          isGlobal
                          isSimple
                          onReadToggleClick={toggleNotificationReadWithDelay}
                          onLinkClick={markNotificationSeen}
                        />
                      }
                      {projectSources.filter(source => source.notifications.length > 0).map(source => (
                        <NotificationsSection
                          {...source}
                          key={source.id}
                          isSimple
                          onReadToggleClick={toggleNotificationReadWithDelay}
                          onLinkClick={markNotificationSeen}
                        />
                      ))}
                    </div>
                  </ScrollLock>,
                  <NotificationsReadAll key="footer" to="/notifications">
                    {
                      hiddenByLimitCount > 0 ?
                        `View ${hiddenByLimitCount} older notification${hiddenByLimitCount > 1 ? 's' : ''}` :
                        'View all notifications'
                    }
                  </NotificationsReadAll>
                ])}
              </NotificationsDropdown>
            )
          } else {
            const notificationsBySources = limitQuantityInSources(
              allNotificationsBySources,
              NOTIFICATIONS_NEW_PER_SOURCE,
              oldSourceIds
            )
            const globalSource = notificationsBySources.length > 0 && notificationsBySources[0].id === 'global' ? notificationsBySources[0] : null
            const projectSources = notificationsBySources.length > 1 && globalSource ? notificationsBySources.slice(1) : notificationsBySources

            return (
              <NotificationsMobilePage
                hasUnread={hasUnread}
                hasNew={hasNew}
                onToggle={() => {
                  toggleNotificationsDropdownMobile()
                  visitNotifications()
                }}
                isOpen={isDropdownMobileOpen}
              >
                {!hasUnread ? (
                  notificationsEmpty
                ) : (
                  <div>
                    {globalSource && globalSource.notifications.length > 0 &&
                      <NotificationsSection
                        {...globalSource}
                        isGlobal
                        isSimple
                        onReadToggleClick={toggleNotificationReadWithDelay}
                        onViewOlderClick={() => viewOlderNotifications(globalSource.id)}
                        onLinkClick={(notificationId) => {
                          toggleNotificationsDropdownMobile()
                          markNotificationSeen(notificationId)
                        }}
                      />}
                    {projectSources.filter(source => source.notifications.length).map(source => (
                      <NotificationsSection
                        {...source}
                        key={source.id}
                        isSimple
                        onReadToggleClick={toggleNotificationReadWithDelay}
                        onViewOlderClick={() => viewOlderNotifications(source.id)}
                        onLinkClick={(notificationId) => {
                          toggleNotificationsDropdownMobile()
                          markNotificationSeen(notificationId)
                        }}
                      />
                    ))}
                  </div>
                )}
              </NotificationsMobilePage>
            )
          }
        }}
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
  toggleBundledNotificationRead,
  viewOlderNotifications,
  hideOlderNotifications,
  toggleNotificationsDropdownMobile
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsDropdownContainer)
