/**
 * Message to show when there is no notifications
 */
import React from 'react'
import PropTypes from 'prop-types'
import SVGIconImage from '../SVGIconImage'
import './NotificationsEmpty.scss'

const NotificationsEmpty = (props) => (
  <div className="notifications-empty">
    <div className="icon"><SVGIconImage filePath="ui-bell"/></div>
    <p className="message">Good job! You’re all caught up</p>
    {props.children && <div className="additional-content">{props.children}</div>}
  </div>
)

NotificationsEmpty.propTypes = {
  children: PropTypes.node
}

export default NotificationsEmpty
