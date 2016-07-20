import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ProjectDetail    from './components/ProjectDetail'
import ProjectDashboard    from './components/Dashboard.jsx'
import ProjectSpecification from './components/ProjectSpecification.jsx'
// <Route path="dashboard" component={ Dashboard } />
//
const projectDetailRoutes = (
  <Route path="/projects/:projectId" component={ ProjectDetail }>
    <IndexRoute component={ ProjectDashboard } />
    <Route path="specification" component={ ProjectSpecification } />
  </Route>
)

export default projectDetailRoutes
