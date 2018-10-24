import React from 'react'
import { Link } from 'react-router-dom'
import './SettingsSidebar.module.scss'

const settings = [{
  name: 'My profile',
  path: '/settings/profile'
}, {
  name: 'Account and security',
  path: '/settings/system'
}, {
  name: 'Notifications',
  path: '/settings/notifications'
}]

const getOption = (selected, setting) => {
  const selectedStyle = (setting.name === selected) ? 'selected-option' : ''
  return (
    <Link to={setting.path} key={setting.name}>
      <div styleName={'options ' + selectedStyle}>
        {setting.name}
      </div>
    </Link>
  )
}

const footer = () => {
  return (
    <div styleName="footer">
      <div styleName="menu">
        <a href="https://www.topcoder.com/about-topcoder/">About</a>&#9679;
        <a href="https://www.topcoder.com/about-topcoder/contact/">Contact</a>&#9679;
        <a href="https://www.topcoder.com/community/how-it-works/privacy-policy/">Privacy</a>&#9679;
        <a href="https://connect.topcoder.com/terms">Terms</a>
      </div>
      <div styleName="copyright-notice">
        © Topcoder 2018
      </div>
    </div>
  )
}

const getMobileOption = (selected, setting) => {
  const selectedStyle = (setting.name === selected) ? 'selected' : ''
  return (
    <Link to={setting.path} key={setting.name}>
      <div styleName={'option-mobile ' + selectedStyle}>
        {setting.name}
      </div>
      {(setting.name === selected) &&
        <div styleName="option-highlight"/>
      }
    </Link>
  )
}

const Sidebar = ({selected}) => {
  return (
    <div styleName="container">
      <div styleName="sidebar">
        <div styleName="title">
          TOPCODER SETTINGS
        </div>
        {settings.map(getOption.bind(this, selected))}
        {footer()}
      </div>
      <div styleName="topbar">
        {settings.map(getMobileOption.bind(this, selected))}
      </div>
    </div>
  )
}

export default Sidebar