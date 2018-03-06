import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withProps } from 'recompose'
import { renderApp } from '../components/App/App'
import ProjectLayout from './ProjectLayout'
import Projects from './list/components/Projects/Projects'
import TopBarContainer from '../components/TopBar/TopBarContainer'
import ProjectsToolBar from '../components/TopBar/ProjectsToolBar'
import ProjectToolBar from '../components/TopBar/ProjectToolBar'
import FileDownload from '../components/FileDownload'
import ProjectDetail from './detail/ProjectDetail'
import Dashboard     from './detail/Dashboard'
import ProjectMessages from './detail/Messages'
import SpecificationContainer from './detail/containers/SpecificationContainer'
import ProjectProductsContainer from './detail/containers/ProjectProductsContainer'
import CreateContainer from './create/containers/CreateContainer'
import { requiresAuthentication } from '../components/AuthenticatedComponent'

const ProjectLayoutWithAuth = requiresAuthentication(ProjectLayout)
const FileDownloadWithAuth = requiresAuthentication(FileDownload)

// NOTE:
// we cannot move up ProjectDetail component
// we have to keep it like it's done below because
// Dashboard, SpecificationContainer and ProjectMessages have to be immediate children
// of ProjectDetail component because ProjectDetail updates children props by React.Children method
const ProjectDetailWithAuth = withProps({ main:
  <Switch>
    <Route exact path="/projects/:projectId" render={() => <ProjectDetail><Dashboard /></ProjectDetail>} />
    <Route path="/projects/:projectId/status/:statusId" render={() => <ProjectDetail><Dashboard /></ProjectDetail>} />
    <Route path="/projects/:projectId/specification/stage/:stageId" render={() => <ProjectDetail><SpecificationContainer /></ProjectDetail>} />
    <Route path="/projects/:projectId/stage/new-product" render={() => <ProjectDetail><CreateContainer /></ProjectDetail>} />
    <Route path="/projects/:projectId/stages" render={() => <ProjectDetail><ProjectProductsContainer /></ProjectDetail>} />
    <Route path="/projects/:projectId/discussions/:discussionId?" render={() => <ProjectDetail><ProjectMessages /></ProjectDetail>} />
  </Switch>
})(ProjectLayoutWithAuth)

const ProjectsWithAuth = withProps({ main: <Projects /> })(ProjectLayoutWithAuth)

const projectRoutes = (
  <Route
    path="/projects"
    render={() => (
      <Switch>
        <Route path="/projects/:projectId/attachments/:attachmentId" render={renderApp(<FileDownloadWithAuth />, null)} />
        <Route path="/projects/:projectId" render={renderApp(<TopBarContainer toolbar={ProjectToolBar} />, <ProjectDetailWithAuth />)} />
        <Route path="/projects" render={renderApp(<TopBarContainer toolbar={ProjectsToolBar} />, <ProjectsWithAuth />)} />
      </Switch>
    )}
  />
)

export default projectRoutes
