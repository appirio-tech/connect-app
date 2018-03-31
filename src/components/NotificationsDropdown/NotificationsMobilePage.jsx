/**
 * Fullscreen popup which shows notifications in mobile resolution
 */
import React from 'react'
import PropTypes from 'prop-types'
import MobilePage from '../MobilePage/MobilePage'
import NotificationsBell from './NotificationsBell'
import './NotificationsMobilePage.scss'

class NotificationsDropdown extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { isOpen } = this.state
    const { onToggle, children, hasUnread, hasNew } = this.props

    return (
      <div styleName="container">
        <NotificationsBell
          hasUnread={hasUnread}
          hasNew={hasNew}
          onClick={() => {
            this.toggle()
            onToggle()
          }}
        />
        {isOpen && (
          <MobilePage title="Notifications" onClose={this.toggle}>
            {children}
          </MobilePage>
        )}
      </div>
    )
  }
}

NotificationsDropdown.propTypes = {
  hasUnread: PropTypes.bool,
  hasNew: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default NotificationsDropdown
