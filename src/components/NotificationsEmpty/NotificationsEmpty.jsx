/**
 * Message to show when there is no notifications
 */
import React from 'react'
import PropTypes from 'prop-types'
import './NotificationsEmpty.scss'
import Bell from '../../assets/icons/ui-bell.svg'



const NotificationsEmpty = ({children, message = 'Good job! You’re all caught up'}) => (
  <div className="notifications-empty">
    <div className="icon">
      <Bell className="icon-ui-bell"/>
    </div>
    <p className="message">{message}</p>
    {children && <div className="additional-content">{children}</div>}
  </div>
)

NotificationsEmpty.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node
}

export default NotificationsEmpty
