/**
 * Header for NotificatonsDropdown component
 *
 * Shows title and "Mark all as read" button
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './NotificationsDropdownHeader.scss'

const NotificationsDropdownHeader = (props) => (
  <div className="notifications-dropdown-header">
    <h3 className="header">Notifications</h3>
    <div className="right-content">
      <button className="tc-btn tc-btn-link mark-all" onClick={props.onMarkAllClick} disabled={!props.hasUnread}>Mark all as read</button>
      {
        props.hasUnread ?
          (<div className="right-content"><span className="dot"/><Link to="/settings/notifications" className="tc-btn tc-btn-link settings">Settings</Link></div>) : ''
      }
    </div>
  </div>
)

NotificationsDropdownHeader.propTypes = {
  onMarkAllClick: PropTypes.func.isRequired,
  hasUnread: PropTypes.bool
}

export default NotificationsDropdownHeader
