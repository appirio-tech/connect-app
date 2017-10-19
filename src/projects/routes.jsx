import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withProps } from 'recompose'
import App from '../components/App/App'
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

const renderApp = (topbar, content) => () => (
  <App {...{topbar, content}} />
)

const ProjectLayoutWithAuth = requiresAuthentication(ProjectLayout)

// NOTE:
// we cannot move up ProjectDetail component
// we have to keep it like it's done below because
// Dashboard, SpecificationContainer and ProjectMessages have to be immediate children
// of ProjectDetail component because ProjectDetail updates children props by React.Children method
const ProjectDetailWithAuth = withProps({ main:
  <Switch>
    <Route exact path="/projects/:projectId" render={() => <ProjectDetail><Dashboard /></ProjectDetail>} />
    <Route path="/projects/:projectId/status/:statusId" render={() => <ProjectDetail><Dashboard /></ProjectDetail>} />
    <Route path="/projects/:projectId/specification" render={() => <ProjectDetail><SpecificationContainer /></ProjectDetail>} />
    <Route path="/projects/:projectId/discussions(/:discussionId)" render={() => <ProjectDetail><ProjectMessages /></ProjectDetail>} />
  </Switch>
})(ProjectLayoutWithAuth)

const ProjectsWithAuth = withProps({ main: <Projects /> })(ProjectLayoutWithAuth)

const projectRoutes = (
  <Route
    path="/projects"
    render={() => (
      <Switch>
        <Route path="/projects/:projectId" render={renderApp(<TopBarContainer toolbar={ProjectToolBar} />, <ProjectDetailWithAuth />)} />
        <Route path="/projects" render={renderApp(<TopBarContainer toolbar={ProjectsToolBar} />, <ProjectsWithAuth />)} />
      </Switch>
    )}
  />
)

export default projectRoutes
