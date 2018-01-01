/**
 * Header for NotificatonsDropdown component
 *
 * Shows title and "Mark all as read" button
 */
import React, { PropTypes } from 'react'
import './NotificationsDropdownHeader.scss'

const NotificationsDropdownHeader = (props) => (
  <div className="notifications-dropdown-header">
    <h3 className="header">Notifications</h3>
    <button className="tc-btn tc-btn-link mark-all" onClick={props.onMarkAllClick} disabled={!props.hasUnread}>Mark all as read</button>
  </div>
)

NotificationsDropdownHeader.propTypes = {
  onMarkAllClick: PropTypes.func.isRequired,
  hasUnread: PropTypes.bool
}

export default NotificationsDropdownHeader
