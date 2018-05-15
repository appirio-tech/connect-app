/**
 * Fullscreen popup which shows notifications in mobile resolution
 */
import React from 'react'
import PropTypes from 'prop-types'
import MobilePage from '../MobilePage/MobilePage'
import { Link } from 'react-router-dom'
import NotificationsBell from './NotificationsBell'
import XMartIcon from '../../assets/icons/x-mark-white.svg'
import SettingsIcon from '../../assets/icons/ui-16px-1_settings-gear-64.svg'
import './NotificationsMobilePage.scss'

const NotificationsDropdown = ({ onToggle, children, hasUnread, hasNew, isOpen }) => (
  <div styleName="container">
    <NotificationsBell
      hasUnread={hasUnread}
      hasNew={hasNew}
      onClick={onToggle}
    />
    {isOpen && (
      <MobilePage>
        <div styleName="header">
          <Link styleName="btn" to="/settings/notifications"><SettingsIcon styleName="settings-icon" /></Link>
          <div styleName="title">Notifications</div>
          <div styleName="btn" onClick={onToggle}><XMartIcon /></div>
        </div>
        <div styleName="body">
          {children}
        </div>
      </MobilePage>
    )}
  </div>
)

NotificationsDropdown.propTypes = {
  hasUnread: PropTypes.bool,
  hasNew: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default NotificationsDropdown
