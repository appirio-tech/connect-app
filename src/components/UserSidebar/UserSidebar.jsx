import React from 'react'
import PropTypes from 'prop-types'
import UserSummary from '../UserSummary/UserSummary'
import MenuList from '../MenuList/MenuList'
import FileIcon from '../../assets/icons/file.svg'

import './UserSidebar.scss'

const navLinks = [{
  label: 'ALL PROJECTS',
  to: '/projects',
  Icon: FileIcon
}, {
  label: 'MY PROFILE',
  to: '/settings/profile',
  Icon: FileIcon,
  exact: true
}, {
  label: 'NOTIFICATION SETTINGS',
  to: '/settings/notifications',
  Icon: FileIcon,
  exact: true
}, {
  label: 'ACCOUNT & SECURITY',
  to: '/settings/account',
  Icon: FileIcon,
  exact: true
}, {
  label: 'NOTIFICATIONS',
  to: '/notifications',
  Icon: FileIcon,
  exact: true
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
