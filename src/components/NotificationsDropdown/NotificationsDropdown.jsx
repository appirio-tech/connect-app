/**
 * Notifications dropdown
 *
 * A bell icon which toggles a dropdown with notifications
 */
import React, { PropTypes } from 'react'
import SVGIconImage from '../SVGIconImage'
import Dropdown from '../Dropdown/Dropdown'
import cn from 'classnames'
import './NotificationsDropdown.scss'

const NotificationsDropdown = (props) => {
  return (
    <div className="notifications-dropdown">
      <Dropdown theme="UserDropdownMenu" pointerShadow noAutoclose>
        <div className="dropdown-menu-header">
          <div className={cn('notifications-dropdown-bell', { 'has-unread': props.hasUnread })}><SVGIconImage filePath="ui-bell" /></div>
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
