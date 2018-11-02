/**
 * Settings routes
 */
import React from 'react'
import { Route } from 'react-router-dom'
import { renderApp } from '../../components/App/App'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import NotificationsToolBar from '../notifications/components/NotificationsToolBar'
import NotificationSettingsContainer from './routes/notifications/containers/NotificationSettingsContainer'
// import SettingsToolBar from './components/SettingsToolBar'
// import SystemSettingsContainer from './routes/system/containers/SystemSettingsContainer'
// import ProfileSettingsContainer from './routes/profile/containers/ProfileSettingsContainer'

export default (
  {/*<Route path="/settings/profile" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <ProfileSettingsContainer />)} />*/},
  {/*<Route path="/settings/system" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <SystemSettingsContainer />)} />*/},
  <Route path="/settings/notifications" render={renderApp(<TopBarContainer toolbar={NotificationsToolBar} />, <NotificationSettingsContainer />)} />
)
