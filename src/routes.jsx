import React from 'react'
import Route from 'react-router/lib/Route'

import App             from './components/App/App'
import Projects    from './components/Projects/Projects'

import projectDetailRoutes from './projects/detail/routes.jsx'

export default (
  <Route path="/" component={ App }>
    <Route path="projects" component={ Projects } />
    {projectDetailRoutes}
  </Route>
)
