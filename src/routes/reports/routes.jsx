/**
 * Settings routes
 */
import React from 'react'
import { Route } from 'react-router-dom'
import { renderApp } from '../../components/App/App'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import ReportsToolBar from './components/ReportsToolBar'
import { requiresAuthentication } from '../../components/AuthenticatedComponent'
import UserReportsContainer from './containers/UserReportsContainer'
const UserReportsContainerWithAuth = requiresAuthentication(UserReportsContainer)
export default (
  <Route path="/reports" exact render={renderApp(<TopBarContainer toolbar={ReportsToolBar} />, <UserReportsContainerWithAuth />)} />
)
