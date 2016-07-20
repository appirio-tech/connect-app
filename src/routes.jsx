import React from 'react'
import Route from 'react-router/lib/Route'

import App             from './components/App/App'

import projectDetailRoutes from './projects/detail/routes.jsx'
import projectsListRoutes from './projects/list/routes.jsx'

export default (
  <Route path="/" component={ App }>
    {projectDetailRoutes}
    {projectsListRoutes}
  </Route>
)
