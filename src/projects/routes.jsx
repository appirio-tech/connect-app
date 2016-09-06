import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ProjectLayout from './ProjectLayout'

import Projects from './list/components/Projects/Projects'
import Walkthrough from './list/components/Walkthrough/Walkthrough'
import ProjectsTopBar from './list/components/ProjectsTopBar/ProjectsTopBar'

import ProjectDetail from './detail/ProjectDetail'
import Dashboard     from './detail/Dashboard'
import ProjectMessages from './detail/Messages'
import ProjectSpecification from './detail/containers/Specification'
import ProjectToolBar from './detail/components/ProjectToolBar/ProjectToolBar'
import CreateProjectWizard from './create/components/CreateView'
import { requiresAuthentication } from '../components/AuthenticatedComponent'


const projectRoutes = (
  <Route path="/projects" component={ requiresAuthentication(ProjectLayout) }>
    // TODO add project topbar
    <IndexRoute components={{topbar: null, main: Projects }} />
    <Route path="create" components={{topbar: null, main: CreateProjectWizard}} />
    <Route path="walkthrough" components={{topbar: ProjectsTopBar, main: Walkthrough }} />
    <Route path=":projectId" components={{topbar: ProjectToolBar, main: ProjectDetail}} >
      <IndexRoute component={ Dashboard } />
      <Route path="specification" component={ ProjectSpecification } />
      <Route path="messages" component={ ProjectMessages } />
    </Route>
  </Route>
)

export default projectRoutes
