import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ProjectLayout from './ProjectLayout'
import Projects from './list/components/Projects/Projects'
import TopBarContainer from '../components/TopBar/TopBarContainer'
import ProjectsToolBar from '../components/TopBar/ProjectsToolBar'
import ProjectToolBar from '../components/TopBar/ProjectToolBar'
import ProjectDetail from './detail/ProjectDetail'
import Dashboard     from './detail/Dashboard'
import ProjectMessages from './detail/Messages'
import SpecificationContainer from './detail/containers/SpecificationContainer'
import { requiresAuthentication } from '../components/AuthenticatedComponent'


const projectRoutes = (
  <Route path="/projects" components={ { topbar: (props) => <TopBarContainer toolbar={ props.toolbar } shortUserMenu={ props.shortUserMenu } />, content: requiresAuthentication(ProjectLayout)}}>
    // TODO add project topbar
    <IndexRoute components={{toolbar: ProjectsToolBar, main: Projects }} />
    <Route path=":projectId" components={{toolbar: ProjectToolBar, main: ProjectDetail }} >
      <IndexRoute component={ Dashboard } />
      // <Route path="status/:statusId" component={ Dashboard } />
      <Route path="specification" component={ SpecificationContainer } />
      <Route path="discussions(/:discussionId)" component={ ProjectMessages } />
    </Route>
  </Route>
)

export default projectRoutes
