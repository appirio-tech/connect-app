import React from 'react'
import PropTypes from 'prop-types'
import UserSummary from '../UserSummary/UserSummary'
import MenuList from '../MenuList/MenuList'
import NotificationsIcon from '../../assets/icons/ui-bell.svg'
import AllProjectsIcon from '../../assets/icons/v.2.5/icon-all-projects.svg'
import MyProfileIcon from '../../assets/icons/v.2.5/icon-my-profile.svg'
import NotificationSettingsIcon from '../../assets/icons/v.2.5/icon-notification-setting.svg'
import AccountSecurityIcon from '../../assets/icons/v.2.5/icon-account-security.svg'

import './UserSidebar.scss'

const navLinks = [{
  label: 'ALL PROJECTS',
  to: '/projects',
  Icon: AllProjectsIcon,
  iconClassName: 'fill',
  exact: false,
}, {
  label: 'MY PROFILE',
  to: '/settings/profile',
  Icon: MyProfileIcon,
  iconClassName: 'fill',
}, {
  label: 'NOTIFICATION SETTINGS',
  to: '/settings/notifications',
  Icon: NotificationSettingsIcon,
  iconClassName: 'fill',
}, {
  label: 'ACCOUNT & SECURITY',
  to: '/settings/account',
  Icon: AccountSecurityIcon,
  iconClassName: 'fill',
}, {
  label: 'NOTIFICATIONS',
  to: '/notifications',
  Icon: NotificationsIcon,
  iconClassName: 'fill',
}]

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
