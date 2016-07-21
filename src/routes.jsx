import React from 'react'
import {Route, Redirect} from 'react-router'
import App             from './components/App/App'
import projectRoutes from './projects/routes.jsx'

export default (
  <Route path="/" component={ App }>
    // Handle /projects/* routes
    <Redirect from='/#/projects/1/' to='/projects/1/' />
    {projectRoutes}

  </Route>
)
