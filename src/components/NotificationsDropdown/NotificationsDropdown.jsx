/**
 * Notifications dropdown
 *
 * A bell icon which toggles a dropdown with notifications
 */
import React from 'react'
import PropTypes from 'prop-types'
import EnhancedDropdown from './EnhancedDropdown'
import NotificationsBell from './NotificationsBell'


class NotificationsDropdown extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle(isOpen) {
    if (typeof isOpen === 'object') {
      this.props.toggle(!this.state.isOpen)
      this.setState({ isOpen: !this.state.isOpen})
    } else {
      this.props.toggle(isOpen)
    }
  }

  render() {
    return (
      <div className="notifications-dropdown">
        <EnhancedDropdown theme="UserDropdownMenu" pointerShadow noAutoclose onToggle={this.toggle}>
          <div className="dropdown-menu-header">
            <NotificationsBell
              hasUnread={props.hasUnread}
              hasNew={props.hasNew}
              onClick={this.toggle}
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
}

NotificationsDropdown.propTypes = {
  hasUnread: PropTypes.bool,
  hasNew: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.node
}

export default NotificationsDropdown
