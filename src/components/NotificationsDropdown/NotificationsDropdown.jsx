/**
 * Notifications dropdown
 *
 * A bell icon which toggles a dropdown with notifications
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'appirio-tech-react-components'
import cn from 'classnames'
import SVGIcons from '../Icons/Icons'

const NotificationsDropdown = (props) => {
  return (
    <div className="notifications-dropdown">
      <Dropdown theme="UserDropdownMenu" pointerShadow noAutoclose>
        <div className="dropdown-menu-header">
          <div className={cn('notifications-dropdown-bell', { 'has-unread': props.hasUnread })}>
            <SVGIcons.IconBell className="icon-ui-bell"/>
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
