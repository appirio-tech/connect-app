/**
 * Settings routes
 */
import React from 'react'
import { Route } from 'react-router-dom'
import { renderApp } from '../../components/App/App'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import NotificationSettingsContainer from './routes/notifications/containers/NotificationSettingsContainer'
import SettingsToolBar from './components/SettingsToolBar'
import SystemSettingsContainer from './routes/system/containers/SystemSettingsContainer'
import ProfileSettingsContainer from './routes/profile/containers/ProfileSettingsContainer'
import EmailVerificationContainer from './routes/email-verification/containers/EmailVerificationContainer'
import { requiresAuthentication } from '../../components/AuthenticatedComponent'
const SystemSettingsContainerWithAuth = requiresAuthentication(SystemSettingsContainer)
const NotificationSettingsContainerWithAuth = requiresAuthentication(NotificationSettingsContainer)
const ProfileSettingsContainerWithAuth = requiresAuthentication(ProfileSettingsContainer)
export default [
  <Route key="account" exact path="/settings/account" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <SystemSettingsContainerWithAuth />)} />,
  <Route key="account/email-verification" exact path="/settings/account/email-verification" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <EmailVerificationContainer />)} />,
  <Route key="notifications" exact path="/settings/notifications" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <NotificationSettingsContainerWithAuth />)} />,
  <Route key="profile" exact path="/settings/profile" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <ProfileSettingsContainerWithAuth />)} />,
]
