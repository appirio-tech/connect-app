/**
 * Notifications dropdown
 *
 * A bell icon which toggles a dropdown with notifications
 */
import React from 'react'
import PropTypes from 'prop-types'
import EnhancedDropdown from './EnhancedDropdown'
import NotificationsBell from './NotificationsBell'


const NotificationsDropdown = (props) => {
  return (
    <div className="notifications-dropdown">
      <EnhancedDropdown theme="UserDropdownMenu" pointerShadow noAutoclose onToggle={props.onToggle}>
        <div className="dropdown-menu-header">
          <NotificationsBell
            hasUnread={props.hasUnread}
            hasNew={props.hasNew}
            onClick={props.onToggle}
          />
        </div>
        <div className="dropdown-menu-list">
          <div className="notifications-dropdown-content">
            {props.children}
          </div>
        </div>
      </EnhancedDropdown>
    </div>
  )
}

NotificationsDropdown.propTypes = {
  hasUnread: PropTypes.bool,
  hasNew: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.node
}

export default NotificationsDropdown
