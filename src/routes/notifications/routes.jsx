/**
 * Notifications routes
 */
import React from 'react'
import { Route } from 'react-router-dom'
import { renderApp } from '../../components/App/App'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import NotificationsToolBar from './components/NotificationsToolBar'
import NotificationsContainer from './containers/NotificationsContainer'

export default (
  <Route path="/notifications" render={renderApp(<TopBarContainer toolbar={NotificationsToolBar} />, <NotificationsContainer />)} />
)
