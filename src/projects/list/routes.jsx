import React from 'react'
import { Route } from 'react-router'

import Projects    from './components/Projects/Projects'

const projectsListRoutes = (
  <Route path="/projects/" component={ Projects } />
)

export default projectsListRoutes
