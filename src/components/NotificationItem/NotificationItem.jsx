/**
 * Notification Item
 *
 * Has a tick to toggle read status
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NOTIFICATION_TYPE } from '../../config/constants'
import SVGIconImage from '../SVGIconImage'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './NotificationItem.scss'

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
  const notificationItem = (
    <div className="notification-item">
      <div className="icon"><SVGIconImage filePath={'notification-' + props.type} /></div>
      <div className="body">
        <p className="content" dangerouslySetInnerHTML={{ __html: props.text }} />
        <p className="date">{formatDate(props.date)}</p>
      </div>
      <div className="mark-read">
        <button
          onClick={(evt) => {
            evt.preventDefault()
            props.onReadToggleClick(props.id)
          }}
        >
          <SVGIconImage filePath="check" />
        </button>
      </div>
    </div>
  )

  return ( props.goto
    ? <Link className="notification-item-link" to={props.goto}>{notificationItem}</Link>
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
  onReadToggleClick: PropTypes.func.isRequired
}

export default NotificationItem
