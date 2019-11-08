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
import EmailVerificationFailure from './routes/email-verification/components/Failure'
import EmailVerificationSuccessContainer from './routes/email-verification/containers/SuccessContainer'

export default [
  <Route key="account" exact path="/settings/account" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <SystemSettingsContainer />)} />,
  <Route key="account/email-verification/success" exact path="/settings/account/email-verification/success/:handle/:token/:newEmail/:oldEmail/:jwtToken" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <EmailVerificationSuccessContainer />)} />,
  <Route key="account/email-verification/failure" exact path="/settings/account/email-verification/failure" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <EmailVerificationFailure />)} />,
  
  <Route key="notifications" exact path="/settings/notifications" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <NotificationSettingsContainer />)} />,
  <Route key="profile" exact path="/settings/profile" render={renderApp(<TopBarContainer toolbar={SettingsToolBar} />, <ProfileSettingsContainer />)} />,
  
]
