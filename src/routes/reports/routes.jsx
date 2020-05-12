/**
 * Settings routes
 */
import React from 'react'
import { Route } from 'react-router-dom'
import { renderApp } from '../../components/App/App'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import ProjectsToolBar from '../../components/TopBar/ProjectsToolBar'
import { requiresAuthentication } from '../../components/AuthenticatedComponent'
import UserReportsContainer from './containers/UserReportsContainer'
const UserReportsContainerWithAuth = requiresAuthentication(UserReportsContainer)
export default [
  <Route key="reports" exact path="/reports" render={renderApp(<TopBarContainer toolbar={ProjectsToolBar} />, <UserReportsContainerWithAuth />)} />,
  
]
