/**
 * Notification Item
 *
 * Has a tick to toggle read status
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import { NOTIFICATION_TYPE } from '../../config/constants'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './NotificationItem.scss'
import Check from '../../assets/icons/check.svg'
import IconNotificationMememberAdded from '../../assets/icons/notification-member-added.svg'
import IconNotificationNewPosts from '../../assets/icons/notification-new-posts.svg'
import IconNotificationNewProject from '../../assets/icons/notification-new-project.svg'
import IconNotificationReviewPending from '../../assets/icons/notification-review-pending.svg'
import IconNotificationUpdates from '../../assets/icons/notification-updates.svg'
import IconNotificationWarning from '../../assets/icons/notification-warning.svg'

/**
 * @parmas {string} type notification type
 * @parmas {string} class name
 */
const NotificationIcons = ({ type, className }) => {
  switch(type){
  case 'member-added':
    return <IconNotificationMememberAdded className={className}/>
  case 'new-posts':
    return <IconNotificationNewPosts className={className}/>
  case 'new-project':
    return <IconNotificationNewProject className={className}/>
  case 'review-pending':
    return <IconNotificationReviewPending className={className}/>
  case 'updates':
    return <IconNotificationUpdates className={className}/>
  case 'warning':
    return <IconNotificationWarning className={className}/>
  default:
    return 'undefined icon'
  }
}

NotificationIcons.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
}

/**
 * Format date
 *
 * TODO
 * Currently this method doesn't take into account user timezone
 * When there is real data comes from the server and we know source date timezone
 * we have to update this method, probably using moment-timezone package
 *
 * @param  {String} date date to format
 *
 * @return {String}      formated date
 */
const formatDate = (date) => {
  const today = moment()
  const mDate = moment(date)
  let format

  if (mDate.isSame(today, 'd')) {
    format = mDate.fromNow()
  } else if (mDate.isSame(today, 'y')) {
    format = mDate.format('MMM DD')
  } else {
    format = mDate.format('MMM DD, YYYY')
  }

  return format
}

const NotificationItem = (props) => {
  const { id, onLinkClick } = props
  const notificationItem = (
    <div className={cn('notification-item', props.goto ? '' : props.transitionState)}>
      <div className="icon">
        <NotificationIcons type={props.type} className={'icon-notification' + props.type }/>
      </div>
      <div className="body">
        <p className="content" dangerouslySetInnerHTML={{ __html: props.text }} />
        <p className="date">{formatDate(props.date)}</p>
      </div>
      <div className="mark-read">
        <button
          onClick={(evt) => {
            evt.preventDefault()
            evt.stopPropagation()
            props.onReadToggleClick(props.id)
          }}
        >
          <Check className="icon-check"/>
        </button>
      </div>
    </div>
  )

  return (
    props.goto
      ? <Link className={cn('notification-item-link', {unseen: !props.seen}, props.transitionState)} to={props.goto} onClick={() => onLinkClick(id)}>{notificationItem}</Link>
      : notificationItem
  )
}

const notificationType = PropTypes.oneOf(_.values(NOTIFICATION_TYPE))

NotificationItem.propTypes = {
  type: notificationType.isRequired,
  text: PropTypes.string.isRequired,
  goTo: PropTypes.string,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  transitionState: PropTypes.string.isRequired,
  seen: PropTypes.bool,
  onReadToggleClick: PropTypes.func.isRequired,
  onLinkClick: PropTypes.func.isRequired,
}

export default NotificationItem
