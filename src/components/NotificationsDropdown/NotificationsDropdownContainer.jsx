/**
 * Container component for NotificationsDropdown component
 *
 * Connects to the state and prepare data for dummy component
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import { TransitionGroup, Transition } from 'react-transition-group'
import { getNotifications, toggleNotificationSeen, markAllNotificationsRead, markAllNotificationsSeen, toggleNotificationRead,
  toggleBundledNotificationRead, viewOlderNotifications, hideOlderNotifications } from '../../routes/notifications/actions'
import {
  splitNotificationsBySources,
  filterReadNotifications,
  filterSeenNotifications,
  limitQuantityInSources,
  preRenderNotifications,
} from '../../routes/notifications/helpers/notifications'
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

const NotificationsDropdownContainerView = (props) => {
  const {initialized, isLoading, sources, notifications, markAllNotificationsRead, toggleNotificationRead, toggleNotificationSeen,
    pending, toggleBundledNotificationRead, oldSourceIds, viewOlderNotifications, isDropdownMobileOpen, isDropdownWebOpen,
    toggleNotificationsDropdownMobile, toggleNotificationsDropdownWeb, markAllNotificationsSeen } = props
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
  const notSeenNotifications = filterSeenNotifications(notifications)
  const allNotificationsBySources = splitNotificationsBySources(sources, notReadNotifications)

  const hasUnread = notReadNotifications.length > 0
  const hasUnseen = notSeenNotifications.length > 0
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

  const markNotificationsSeen = (isOpen) => {
    if (isOpen) {
      markAllNotificationsSeen(null, notifications)
    }
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
            <NotificationsDropdown
              hasUnread={hasUnread}
              hasNew={hasUnseen}
              onToggle={(isOpen) => {
                toggleNotificationsDropdownWeb(isOpen)
                markNotificationsSeen(isOpen)
              }}
            >
              {isDropdownWebOpen && <div>
                <NotificationsDropdownHeader onMarkAllClick={() => !pending && markAllNotificationsRead()} hasUnread={hasUnread}/>
                {!hasUnread ? (
                  <div className="notifications-dropdown-body">
                    {notificationsEmpty}
                  </div>
                ) : ([
                  <ScrollLock key="body">
                    <div className="notifications-dropdown-body">
                      <Transition in={globalSource && globalSource.notifications.length} timeout={500} unmountOnExit>
                        {state => (
                          <NotificationsSection
                            {...globalSource}
                            transitionState={state}
                            isGlobal
                            isSimple
                            onReadToggleClick={toggleNotificationReadWithDelay}
                            onLinkClick={(notificationId) => {
                              toggleNotificationsDropdownWeb()
                              markNotificationSeen(notificationId)
                            }}
                          />
                        )}
                      </Transition>
                      <TransitionGroup>
                        {projectSources.filter(source => source.notifications.length > 0).map(source => (
                          <Transition timeout={500} key={source.id} unmountOnExit>
                            {state => (
                              <NotificationsSection
                                {...source}
                                transitionState={state}
                                key={source.id}
                                isSimple
                                onReadToggleClick={toggleNotificationReadWithDelay}
                                onLinkClick={(notificationId) => {
                                  toggleNotificationsDropdownWeb()
                                  markNotificationSeen(notificationId)
                                }}
                              />
                            )}
                          </Transition>
                        ))}
                      </TransitionGroup>
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
              </div>}
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
              hasNew={hasUnseen}
              onToggle={() => {
                toggleNotificationsDropdownMobile()
              }}
              isOpen={isDropdownMobileOpen}
            >
              {!hasUnread ? (
                notificationsEmpty
              ) : (
                <div>
                  <Transition in={globalSource && globalSource.notifications.length} timeout={500} unmountOnExit>
                    {state => (
                      <NotificationsSection
                        {...globalSource}
                        transitionState={state}
                        isGlobal
                        isSimple
                        onReadToggleClick={toggleNotificationReadWithDelay}
                        onViewOlderClick={() => viewOlderNotifications(globalSource.id)}
                        onLinkClick={(notificationId) => {
                          toggleNotificationsDropdownMobile()
                          markNotificationSeen(notificationId)
                        }}
                      />
                    )}
                  </Transition>
                  <TransitionGroup>
                    {projectSources.filter(source => source.notifications.length).map(source => (
                      <Transition timeout={500} key={source.id} unmountOnExit>
                        {state => (
                          <NotificationsSection
                            {...source}
                            transitionState={state}
                            key={source.id}
                            isSimple
                            onReadToggleClick={toggleNotificationReadWithDelay}
                            onViewOlderClick={() => viewOlderNotifications(source.id)}
                            onLinkClick={(notificationId) => {
                              toggleNotificationsDropdownMobile()
                              markNotificationSeen(notificationId)
                            }}
                          />
                        )}
                      </Transition>
                    ))}
                  </TransitionGroup>
                </div>
              )}
            </NotificationsMobilePage>
          )
        }
      }}
    </MediaQuery>
  )
}

class NotificationsDropdownContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDropdownWebOpen: false,
      isDropdownMobileOpen: false,
      notificationsVisited: false,
    }

    this.onToggleNotificationsDropdownWeb = this.onToggleNotificationsDropdownWeb.bind(this)
    this.onToggleNotificationsDropdownMobile = this.onToggleNotificationsDropdownMobile.bind(this)
  }

  componentDidMount() {
    this.props.getNotifications()
    this.autoRefreshNotifications = setInterval(() => this.props.getNotifications(), REFRESH_NOTIFICATIONS_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.autoRefreshNotifications)
    // hide notifications dropdown for mobile, when this component is unmounted
    this.onToggleNotificationsDropdownMobile(false)
    this.onToggleNotificationsDropdownWeb(false)
    this.props.hideOlderNotifications()
  }

  componentWillReceiveProps(nextProps) {
    const currentPathname = this.props.location.pathname
    const nextPathname = nextProps.location.pathname

    if (currentPathname !== nextPathname) {
      // hide notifications dropdown for mobile,
      // when this component persist but URL changed
      this.onToggleNotificationsDropdownMobile(false)
      this.onToggleNotificationsDropdownWeb(false)
      this.props.hideOlderNotifications()
    }
  }

  onToggleNotificationsDropdownWeb(isOpen) {
    this.setState({ isDropdownWebOpen: !_.isUndefined(isOpen) ? isOpen : !this.state.isDropdownWebOpen})
  }

  onToggleNotificationsDropdownMobile(isOpen) {
    this.setState({ isDropdownMobileOpen: !_.isUndefined(isOpen) ? isOpen : !this.state.isDropdownMobileOpen})
  }

  render() {
    const { notifications, ...restProps } = this.props
    const preRenderedNotifications = preRenderNotifications(notifications)
    return (
      <NotificationsDropdownContainerView
        {...restProps}
        notifications={preRenderedNotifications}
        toggleNotificationsDropdownWeb={this.onToggleNotificationsDropdownWeb}
        toggleNotificationsDropdownMobile={this.onToggleNotificationsDropdownMobile}
        isDropdownMobileOpen={this.state.isDropdownMobileOpen}
        isDropdownWebOpen={this.state.isDropdownWebOpen}
      />
    )
  }
}


const mapStateToProps = ({ notifications }) => notifications

const mapDispatchToProps = {
  getNotifications,
  toggleNotificationSeen,
  markAllNotificationsRead,
  markAllNotificationsSeen,
  toggleNotificationRead,
  toggleBundledNotificationRead,
  viewOlderNotifications,
  hideOlderNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsDropdownContainer)
