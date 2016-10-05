import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ProjectLayout from './ProjectLayout'
import Projects from './list/components/Projects/Projects'
import ProjectDetail from './detail/ProjectDetail'
import Dashboard     from './detail/Dashboard'
import ProjectMessages from './detail/Messages'
import ProjectSpecification from './detail/containers/Specification'
import { requiresAuthentication } from '../components/AuthenticatedComponent'


const projectRoutes = (
  <Route path="/projects" component={ requiresAuthentication(ProjectLayout) }>
    // TODO add project topbar
    <IndexRoute components={{topbar: null, main: Projects }} />
    <Route path=":projectId" components={{topbar: null, main: ProjectDetail}} >
      <IndexRoute component={ Dashboard } />
      <Route path="specification" component={ ProjectSpecification } />
      <Route path="discussions" component={ ProjectMessages } />
    </Route>
  </Route>
)

export default projectRoutes
