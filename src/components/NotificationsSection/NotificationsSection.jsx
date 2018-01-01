/**
 * Section of notifications from one source
 *
 * Displays source title, "mark all" button and list of notifications
 */
import React, { PropTypes } from 'react'
import NotificationItem from '../NotificationItem/NotificationItem'
import NotificationsSectionTitle from '../NotificationsSectionTitle/NotificationsSectionTitle'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'
import cn from 'classnames'
import './NotificationsSection.scss'

const NotificationsSection = (props) => {
  return (
    <div className={cn('notifications-section', { 'is-simple': props.isSimple })}>
      {!(props.isSimple && props.isGlobal) &&
        <NotificationsSectionTitle
          title={props.title}
          isGlobal={props.isGlobal}
          onMarkAllClick={props.onMarkAllClick}
        />
      }
      {props.notifications.map(notification => (
        <NotificationItem key={notification.id} {...notification} onReadToggleClick={props.onReadToggleClick}/>
      ))}
      {props.onViewOlderClick && props.total > props.notifications.length && (
          props.isLoading ? (
            <div className="view-older"><LoadingIndicator isSmall /></div>
          ) : (
            <button className="tc-btn view-older" onClick={props.onViewOlderClick}>View {props.total - props.notifications.length} older notifications</button>
          )
        )
      }
    </div>
  )
}

NotificationsSection.propTypes = {
  isSimple: PropTypes.bool,
  isGlobal: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onMarkAllClick: PropTypes.func,
  onReadToggleClick: PropTypes.func.isRequired,
  onViewOlderClick: PropTypes.func,
  total: PropTypes.number,
  notifications: PropTypes.array.isRequired
}

export default NotificationsSection
