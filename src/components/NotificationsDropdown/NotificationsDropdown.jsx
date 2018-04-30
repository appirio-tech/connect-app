/**
 * Notifications dropdown
 *
 * A bell icon which toggles a dropdown with notifications
 */
import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import NotificationsBell from './NotificationsBell'


const NotificationsDropdown = (props) => {
  return (
    <div className="notifications-dropdown">
      <Dropdown theme="UserDropdownMenu" pointerShadow noAutoclose>
        <div className="dropdown-menu-header">
          <NotificationsBell
            hasUnread={props.hasUnread}
            hasNew={props.hasNew}
            onClick={props.onToggl}
          />
        </div>
        <div className="dropdown-menu-list">
          <div className="notifications-dropdown-content">
            {props.children}
          </div>
        </div>
      </Dropdown>
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
