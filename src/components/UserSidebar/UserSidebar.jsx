import React from 'react'
import PropTypes from 'prop-types'
import UserSummary from '../UserSummary/UserSummary'
import MenuList from '../MenuList/MenuList'
import FileIcon from '../../assets/icons/file.svg'

import './UserSidebar.scss'

const navLinks = [{
  label: 'ALL PROJECTS',
  to: '/projects?sort=updatedAt%20desc',
  Icon: FileIcon,
  isActive(_match, location) {
    return !!location.pathname.match(/^\/projects/)
  }
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
}, {
  label: 'NOTIFICATIONS',
  to: '/notifications',
  Icon: FileIcon
}
]

const UserSidebar = ({user}) => {
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

UserSidebar.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserSidebar
