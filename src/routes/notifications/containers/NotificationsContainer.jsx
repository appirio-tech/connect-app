/**
 * Container component for notifications list with filter
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Sticky from '../../../components/Sticky'
import { getNotifications, setNotificationsFilterBy, markAllNotificationsRead,
  toggleNotificationRead, viewOlderNotifications, toggleBundledNotificationRead, 
  hideOlderNotifications, toggleNotificationSeen } from '../actions'
import FooterV2 from '../../../components/FooterV2/FooterV2'
import NotificationsSection from '../../../components/NotificationsSection/NotificationsSection'
import NotificationsSectionTitle from '../../../components/NotificationsSectionTitle/NotificationsSectionTitle'
import SideFilter from '../../../components/SideFilter/SideFilter'
import NotificationsEmpty from '../../../components/NotificationsEmpty/NotificationsEmpty'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import { 
  getNotificationsFilters, 
  splitNotificationsBySources, 
  filterReadNotifications, 
  limitQuantityInSources,
  preRenderNotifications, 
} from '../helpers/notifications'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import { NOTIFICATIONS_NEW_PER_SOURCE } from '../../../config/constants'
import './NotificationsContainer.scss'

const NotificationsContainerView = (props) => {
  if (!props.initialized) {
    return null
  }
  const { sources, notifications, filterBy, setNotificationsFilterBy,
    markAllNotificationsRead, toggleNotificationRead, viewOlderNotifications,
    oldSourceIds, pending, toggleBundledNotificationRead } = props
  const notReadNotifications = filterReadNotifications(notifications)
  const allNotificationsBySources = splitNotificationsBySources(sources, notReadNotifications)
  const notificationsBySources = limitQuantityInSources(
    allNotificationsBySources,
    NOTIFICATIONS_NEW_PER_SOURCE,
    oldSourceIds
  )
  let globalSource = notificationsBySources.length > 0 && notificationsBySources[0].id === 'global' ? notificationsBySources[0] : null
  let projectSources = globalSource ? notificationsBySources.slice(1) : notificationsBySources
  if (filterBy) {
    if (filterBy === 'global') {
      projectSources = []
    } else {
      globalSource = null
      projectSources = _.filter(projectSources, { id: filterBy })
    }
  }

  const toggleNotificationOrBundleRead = (notificationId) => {
    if (!pending) {
      const notification = _.find(notReadNotifications, { id: notificationId })
      // if it's bundled notification, then toggle all notifications inside the bundle
      if (notification.bundledIds) {
        toggleBundledNotificationRead(notificationId, notification.bundledIds)
      } else {
        toggleNotificationRead(notificationId)
      }
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
    <div className="notifications-container">
      <div className="content">
        {globalSource && globalSource.total > 0 &&
          <NotificationsSection
            {...globalSource}
            isGlobal
            onMarkAllClick={() => !pending && markAllNotificationsRead('global', notifications)}
            onReadToggleClick={toggleNotificationOrBundleRead}
            onViewOlderClick={() => viewOlderNotifications(globalSource.id)}
            onLinkClick={(notificationId) => {
              markNotificationSeen(notificationId)
            }}
          />
        }
        {projectSources.length > 0 && <NotificationsSectionTitle title="Project" isGlobal />}
        {projectSources.filter(source => source.total > 0).map(source => (
          <NotificationsSection
            key={source.id}
            {...source}
            onMarkAllClick={() => !pending && markAllNotificationsRead(source.id, notifications)}
            onReadToggleClick={toggleNotificationOrBundleRead}
            onViewOlderClick={() => viewOlderNotifications(source.id)}
            onLinkClick={(notificationId) => {
              markNotificationSeen(notificationId)
            }}
          />
        ))}
        {globalSource || projectSources.length > 0 ?
          <div className="end-of-list">End of list</div> :
          <NotificationsEmpty>
            <p className="notifications-empty-note">
              Maybe you need to check your <Link to="/settings/notifications" className="tc-link">notification settings</Link> to
              get up  to date with the latest activity from your projects?
            </p>
          </NotificationsEmpty>
        }
      </div>
      <aside className="filters">
        <Sticky top={90}>
          <SideFilter
            filterSections={getNotificationsFilters(allNotificationsBySources)}
            selectedFilter={filterBy}
            onFilterItemClick={setNotificationsFilterBy}
          >
            <Link to="/settings/notifications" className="tc-btn tc-btn-default">Notification Settings</Link>
          </SideFilter>
          <FooterV2 />
        </Sticky>
      </aside>
    </div>
  )
}

class NotificationsContainer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    document.title = 'Notifications - TopCoder'

    if (!this.props.initialized) {
      this.props.getNotifications()
    }
  }

  componentWillUnmount() {
    this.props.hideOlderNotifications()
  }

  render() {
    const { notifications, ...restProps } = this.props
    const preRenderedNotifications = preRenderNotifications(notifications)

    return (
      <NotificationsContainerView
        {...{
          ...restProps, 
          notifications: preRenderedNotifications,
        }}
      />
    )
  }
}

const enhance = spinnerWhileLoading(props => !props.isLoading)
const NotificationsContainerWithLoader = enhance(NotificationsContainer)
const NotificationsContainerWithLoaderAndAuth = requiresAuthentication(NotificationsContainerWithLoader)

NotificationsContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  initialized: PropTypes.bool.isRequired,
  notifications: PropTypes.array,
  sources: PropTypes.array,
  filterBy: PropTypes.string,
  oldSourceIds: PropTypes.array,
  pending: PropTypes.bool
}

const mapStateToProps = ({ notifications }) => notifications

const mapDispatchToProps = {
  getNotifications,
  setNotificationsFilterBy,
  markAllNotificationsRead,
  toggleNotificationRead,
  viewOlderNotifications,
  hideOlderNotifications,
  toggleBundledNotificationRead,
  toggleNotificationSeen,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainerWithLoaderAndAuth)
