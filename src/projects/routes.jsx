import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ProjectDetail from './detail/components/ProjectDetail'
import Dashboard     from './detail/components/Dashboard'
import Specification from './detail/components/Specification'
import ProjectTopBar from './detail/components/ProjectTopBar/ProjectTopBar'
import ProjectLayout from './ProjectLayout'

const projectRoutes = (
  <Route path='/projects' component={ ProjectLayout }>
    //TODO - add project listing Route
    <Route path=':projectId' components={{topbar: ProjectTopBar, main: ProjectDetail}} >
      <IndexRoute component={ Dashboard } />
      <Route path='specification' component={ Specification } />
    </Route>
  </Route>
)

export default projectRoutes
