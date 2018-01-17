/**
 * Component to display simple section tool bar
 *
 * Includes:
 * - TopCoder logo
 * - title
 * - optional right side menu
 * - close (cross) button
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './SectionToolBar.scss'
import ConnectLogoMono from '../../assets/icons/connect-logo-mono.svg'
import XMark from '../../assets/icons/x-mark.svg'

/**
 * @params {string} class name
 */
const IconXMark = ({ className }) => {
  return <XMark className={className}/>
}

IconXMark.propTypes = {
  className: PropTypes.string.isRequired
}

/**
 * @params {string} class name
 */
const IconConnectLogoMono = ({ className }) => {
  return <ConnectLogoMono className={className}/>
}

IconXMark.propTypes = {
  className: PropTypes.string.isRequired
}

const SectionToolBar = (props) => {
  const logo = <Link key="logo" to="/" className="logo"><IconConnectLogoMono className="icon-connect-logo-mono" /></Link>
  const title = <div key="title" className="title">{props.title}</div>
  const close = <Link key="close" to="/" className="close"><IconXMark className="icon-x-mark" /></Link>
  const menu = props.menu ? <div key="menu" className="menu">{props.menu}</div> : null

  return (
    <div className="section-tool-bar">
      {menu ? [
        <div key="left" className="section">
          {logo}
          {title}
        </div>,
        <div key="right" className="section">
          {menu}
          {close}
        </div>
      ] : [
        logo,
        title,
        close
      ]}
    </div>
  )
}

SectionToolBar.propTypes = {
  title: PropTypes.string.isRequired,
  menu: PropTypes.array
}

export default SectionToolBar
