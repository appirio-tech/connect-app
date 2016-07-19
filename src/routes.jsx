import React from 'react'
import Route from 'react-router/lib/Route'

import App             from './components/App/App'
import Projects    from './components/Projects/Projects'
import ProjectView    from './components/Project/ProjectView'

export default (
  <Route path="/" component={ App }>
    <Route path="projects" component={ Projects } />
    <Route path="projects/:projectId" component={ ProjectView } />
  </Route>
)
