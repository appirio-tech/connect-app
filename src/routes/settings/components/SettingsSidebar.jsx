import React from 'react'
import PropTypes from 'prop-types'
import UserSummary from '../../../components/UserSummary/UserSummary'
import MenuList from '../../../components/MenuList/MenuList'
import FileIcon from '../../../assets/icons/file.svg'

import './SettingsSidebar.scss'

const navLinks = [{
  label: 'ALL PROJECTS',
  to: '/projects?sort=updatedAt%20desc',
  Icon: FileIcon
}, {
  label: 'MY PROFILE',
  to: '/settings/profile',
  Icon: FileIcon
}, {
  label: 'NOTIFICATION SETTINGS',
  to: '/settings/notifications',
  Icon: FileIcon
}, {
  label: 'ACCOUNT & SECURITY',
  to: '/settings/account',
  Icon: FileIcon
}]

const Sidebar = ({user}) => {
  return (
    <div styleName="container">
      <div className="sideAreaWrapper">
        <UserSummary user={user}/>
        <hr styleName="separator"/>
        <div styleName="section-title">
          SYSTEM
        </div>
        <MenuList navLinks={navLinks}/>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  user: PropTypes.object.isRequired
}

export default Sidebar
