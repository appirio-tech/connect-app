/**
 * Settings routes
 */
import React from 'react'
import { Route } from 'react-router-dom'
import { renderApp } from '../../components/App/App'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import ProjectsToolBar from '../../components/TopBar/ProjectsToolBar'
import { requiresAuthentication } from '../../components/AuthenticatedComponent'
import TopcoderFAQContainer from './containers/TopcoderFAQContainer'
// const AuthFAQContainer = requiresAuthentication(TopcoderFAQContainer)
export default [
  <Route key="faqs" exact path="/faqs" render={renderApp(<TopBarContainer toolbar={ProjectsToolBar} />, <TopcoderFAQContainer />)} />,
  
]
