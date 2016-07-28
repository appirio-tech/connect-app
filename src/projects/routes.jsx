import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ProjectLayout from './ProjectLayout'

import Projects from './list/components/Projects/Projects'

import ProjectDetail from './detail/components/ProjectDetail'
import Dashboard     from './detail/components/Dashboard'
import Specification from './detail/components/Specification'
import ProjectsToolBar from './list/components/ProjectsToolBar/ProjectsToolBar'
import ProjectToolBar from './detail/components/ProjectToolBar/ProjectToolBar'
import CreateProjectWizard from './create/components/CreateView'
import { requiresAuthentication } from '../components/AuthenticatedComponent'



const projectRoutes = (
  // TOOD add auth check requiresAuthentication(ProjectLayout)
  <Route path="/projects" component={ ProjectLayout }>
    // TODO add project topbar
    <IndexRoute components={{topbar: ProjectsToolBar, main: Projects }} />
    <Route path="create" components={{topbar: null, main: CreateProjectWizard}} />
    <Route path=":projectId" components={{topbar: ProjectToolBar, main: ProjectDetail}} >
      <IndexRoute component={ Dashboard } />
      <Route path="specification" component={ Specification } />
    </Route>
  </Route>
)

export default projectRoutes
