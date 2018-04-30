/**
 * Fullscreen popup which shows notifications in mobile resolution
 */
import React from 'react'
import PropTypes from 'prop-types'
import MobilePage from '../MobilePage/MobilePage'
import { Link } from 'react-router-dom'
import ConnectLogoMono from '../../assets/icons/connect-logo-mono.svg'
import NotificationsBell from './NotificationsBell'
import XMartIcon from '../../assets/icons/x-mark-white.svg'
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
          <MobilePage>
            <div styleName="header">
              <Link styleName="logo" to="/"><ConnectLogoMono title="Connect" /></Link>
              <div styleName="title">Notifications</div>
              <div styleName="close-wrapper"><XMartIcon onClick={this.toggle} /></div>
            </div>
            <div styleName="body">
              {children}
            </div>
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
