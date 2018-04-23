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
  toggleNotificationRead, toggleBundledNotificationRead, viewOlderNotifications } from '../../routes/notifications/actions'
import { splitNotificationsBySources, filterReadNotifications, limitQuantityInSources, filterOldNotifications } from '../../routes/notifications/helpers/notifications'
import NotificationsSection from '../NotificationsSection/NotificationsSection'
import NotificationsEmpty from '../NotificationsEmpty/NotificationsEmpty'
import NotificationsDropdownHeader from  '../NotificationsDropdownHeader/NotificationsDropdownHeader'
import NotificationsDropdown from  './NotificationsDropdown'
import NotificationsMobilePage from  './NotificationsMobilePage'
import NotificationsReadAll from './NotificationsReadAll'
import ScrollLock from 'react-scroll-lock-component'
import MediaQuery from 'react-responsive'
import { NOTIFICATIONS_DROPDOWN_PER_SOURCE, NOTIFICATIONS_DROPDOWN_MAX_TOTAL, REFRESH_NOTIFICATIONS_INTERVAL } from '../../config/constants'
import './NotificationsDropdown.scss'

class NotificationsDropdownContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isViewAll: false
    }

    this.viewAll = this.viewAll.bind(this)
  }

  componentDidMount() {
    this.props.getNotifications()
    this.autoRefreshNotifications = setInterval(() => this.props.getNotifications(), REFRESH_NOTIFICATIONS_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.autoRefreshNotifications)
  }

  viewAll() {
    this.setState({isViewAll: true})
  }

  render() {
    if (!this.props.initialized) {
      return <NotificationsDropdown hasUnread={false} />
    }

    const {lastVisited, sources, notifications, markAllNotificationsRead, toggleNotificationRead, toggleNotificationSeen,
      pending, toggleBundledNotificationRead, visitNotifications, oldSourceIds, viewOlderNotifications } = this.props
    const {isViewAll} = this.state
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
    const notOldNotifications = filterOldNotifications(notReadNotifications, oldSourceIds)
    const allNotificationsBySources = splitNotificationsBySources(sources, notOldNotifications)
    let notificationsBySources

    if (!isViewAll) {
      notificationsBySources = limitQuantityInSources(
        allNotificationsBySources,
        NOTIFICATIONS_DROPDOWN_PER_SOURCE,
        NOTIFICATIONS_DROPDOWN_MAX_TOTAL
      )
    } else {
      notificationsBySources = allNotificationsBySources
    }

    const hiddenByLimitCount = _.sumBy(allNotificationsBySources, 'notifications.length') - _.sumBy(notificationsBySources, 'notifications.length')

    const globalSource = notificationsBySources.length > 0 && notificationsBySources[0].id === 'global' ? notificationsBySources[0] : null
    const projectSources = notificationsBySources.length > 1 && globalSource ? notificationsBySources.slice(1) : notificationsBySources
    const hasUnread = notReadNotifications.length > 0
    const olderNotificationsCount = notReadNotifications.length - notOldNotifications.length
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

    const notificationsEmpty = (
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

    return (
      <MediaQuery minWidth={768}>
        {(matches) => (matches ? (
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
                      onLinkClick={toggleNotificationSeen}
                    />
                  }
                  {projectSources.filter(source => source.notifications.length > 0).map(source => (
                    <NotificationsSection
                      {...source}
                      key={source.id}
                      isSimple
                      onReadToggleClick={toggleNotificationReadWithDelay}
                      onLinkClick={toggleNotificationSeen}
                    />
                  ))}
                </div>
              </ScrollLock>,
              <NotificationsReadAll key="footer" to="/notifications">
                {
                  olderNotificationsCount > 0 ?
                    `View ${olderNotificationsCount} older notification${olderNotificationsCount > 1 ? 's' : ''}` :
                    'View all notifications'
                }
              </NotificationsReadAll>
            ])}
          </NotificationsDropdown>
        ) : (
          <NotificationsMobilePage hasUnread={hasUnread} hasNew={hasNew} onToggle={visitNotifications}>
            {!hasUnread ? (
              notificationsEmpty
            ) : (
              <div>
                {globalSource && (globalSource.notifications.length || isViewAll && globalSource.total) &&
                  <NotificationsSection
                    {...globalSource}
                    isGlobal
                    isSimple
                    isLoading={globalSource.isLoading}
                    onReadToggleClick={toggleNotificationReadWithDelay}
                    onViewOlderClick={isViewAll ? () => viewOlderNotifications(globalSource.id) : null}
                    onLinkClick={toggleNotificationSeen}
                  />}
                {projectSources.filter(source => source.notifications.length || isViewAll && source.total).map(source => (
                  <NotificationsSection
                    {...source}
                    key={source.id}
                    isSimple
                    isLoading={source.isLoading}
                    onReadToggleClick={toggleNotificationReadWithDelay}
                    onViewOlderClick={isViewAll ? () => viewOlderNotifications(source.id) : null}
                    onLinkClick={toggleNotificationSeen}
                  />
                ))}
                {!isViewAll && (olderNotificationsCount > 0 || hiddenByLimitCount > 0) &&
                   <NotificationsReadAll onClick={this.viewAll}>Read all notifications</NotificationsReadAll>}
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
  toggleBundledNotificationRead,
  viewOlderNotifications
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsDropdownContainer)
