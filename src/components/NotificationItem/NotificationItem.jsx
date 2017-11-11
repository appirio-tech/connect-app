/**
 * Notification Item
 *
 * Has a tick to toggle read status
 */
import React, { PropTypes } from 'react'
import SVGIconImage from '../SVGIconImage'
import moment from 'moment'
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
  return (
    <div className="notification-item">
      <div className="icon"><SVGIconImage filePath={'notification-' + props.type} /></div>
      <div className="body">
        <p className="content" dangerouslySetInnerHTML={{ __html: props.content }} />
        <p className="date">{formatDate(props.date)}</p>
      </div>
      <div className="mark-read">
        <button onClick={() => props.onReadToggleClick(props.id)}><SVGIconImage filePath="check" /></button>
      </div>
    </div>
  )
}

NotificationItem.propTypes = {
  type: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onReadToggleClick: PropTypes.func.isRequired
}

export default NotificationItem
