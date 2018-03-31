/**
 * Displays page in mobile resolution on top of the current page without changing URL address (kind of fullscreen popup)
 * While displaying the content it cuts the main content
 * so browser scrollbar works for the content of this mobile page
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ConnectLogoMono from '../../assets/icons/connect-logo-mono.svg'
import XMartIcon from '../../assets/icons/x-mark-white.svg'
import './MobilePage.scss'

class MobilePage extends React.Component {
  componentWillMount() {
    document.body.classList.add('hidden-content')
  }

  componentWillUnmount() {
    document.body.classList.remove('hidden-content')
  }

  render() {
    const { title, children, onClose } = this.props

    return (
      <div styleName="container">
        <div styleName="header">
          <Link styleName="logo" to="/"><ConnectLogoMono title="Connect" /></Link>
          <div styleName="title">{title}</div>
          <div styleName="close-wrapper"><XMartIcon onClick={onClose} /></div>
        </div>
        <div>{children}</div>
      </div>
    )
  }
}

MobilePage.defaultProps = {
  defaultOpen: false
}

MobilePage.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  defaultOpen: PropTypes.bool,
}

export default MobilePage
