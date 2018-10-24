import React from 'react'
import { Link } from 'react-router-dom'

import FooterV2 from '../../../components/FooterV2/FooterV2'

import './SettingsSidebar.scss'

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
        <div styleName="footer">
          <FooterV2 />
        </div>
      </div>
      <div styleName="topbar">
        {settings.map(getMobileOption.bind(this, selected))}
      </div>
    </div>
  )
}

export default Sidebar