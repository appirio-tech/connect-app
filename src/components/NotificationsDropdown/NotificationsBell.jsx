/**
 * Notifications bell icon
 */
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Bell from '../../assets/icons/ui-bell.svg'
import './NotificationsBell.scss'

const NotificationsBell = ({ onClick, hasUnread, hasNew }) => {
  return (
    <div styleName={cn('container', { 'has-unread': hasUnread, 'has-new': hasNew })} onClick={onClick}>
      <Bell />
    </div>
  )
}

NotificationsBell.propTypes = {
  hasUnread: PropTypes.bool,
  hasNew: PropTypes.bool,
  onClick: PropTypes.func
}

export default NotificationsBell
