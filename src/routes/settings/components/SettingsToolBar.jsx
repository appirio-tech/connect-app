/**
 * Settings pages tool bar
 */
import React from 'react'
import { NavLink } from 'react-router-dom'
import SectionTopBar from '../../../components/TopBar/SectionToolBar'

const SettingsToolBar = () => (
  <SectionTopBar
    title="Profile and Settings"
    menu={[
      <NavLink key="profile" to="/settings/profile">Profile</NavLink>,
      <NavLink key="system" to="/settings/system">System</NavLink>,
      <NavLink key="notifications" to="/settings/notifications">Notifications</NavLink>
    ]}
  />
)

export default SettingsToolBar
