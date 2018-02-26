/**
 * Notifications dropdown
 *
 * A bell icon which toggles a dropdown with notifications
 */
import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import cn from 'classnames'
import Bell from '../../assets/icons/ui-bell.svg'


const NotificationsDropdown = (props) => {
  return (
    <div className="notifications-dropdown">
      <Dropdown theme="UserDropdownMenu" pointerShadow noAutoclose>
        <div className="dropdown-menu-header">
          <div className={cn('notifications-dropdown-bell', { 'has-unread': props.hasUnread })}>
            <Bell className="icon-ui-bell"/>
          </div>
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
  children: PropTypes.node
}

export default NotificationsDropdown
