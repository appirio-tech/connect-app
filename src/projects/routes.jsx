import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withProps } from 'recompose'
import { renderApp } from '../components/App/App'
import ProjectLayout from './detail/components/ProjectLayout'
import Projects from './list/components/Projects/Projects'
import TopBarContainer from '../components/TopBar/TopBarContainer'
import ProjectsToolBar from '../components/TopBar/ProjectsToolBar'
import ProjectToolBar from '../components/TopBar/ProjectToolBar'
import FileDownload from '../components/FileDownload'
import ProjectDetail from './detail/ProjectDetail'
import Dashboard from './detail/containers/DashboardContainer'
import Scope from './detail/containers/ScopeContainer'
import ProjectPlan from './detail/containers/ProjectPlanContainer'
import ProjectAddPhaseContainer from './detail/containers/ProjectAddPhaseContainer'
import ProjectMessages from './detail/Messages'
import CoderBot from '../components/CoderBot/CoderBot'
import SpecificationContainer from './detail/containers/SpecificationContainer'
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
    <Route path="/projects/:projectId/specification" render={() => <ProjectDetail><SpecificationContainer /></ProjectDetail>} />
    <Route path="/projects/:projectId/scope" render={() => <ProjectDetail><Scope /></ProjectDetail>} />
    <Route path="/projects/:projectId/plan" render={() => <ProjectDetail><ProjectPlan /></ProjectDetail>} />
    <Route path="/projects/:projectId/phase/:phaseId" render={() => <ProjectDetail><ProjectPlan /></ProjectDetail>} />
    <Route path="/projects/:projectId/add-phase" render={() => <ProjectDetail><ProjectAddPhaseContainer /></ProjectDetail>} />
    <Route path="/projects/:projectId/discussions/:discussionId?" render={() => <ProjectDetail><ProjectMessages /></ProjectDetail>} />
    <Route render={() => <CoderBot code={404}/>} />
  </Switch>
})(ProjectLayoutWithAuth)

const ProjectsWithAuth = requiresAuthentication(Projects)

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
