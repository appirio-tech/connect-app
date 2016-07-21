import React from 'react'
import {Route, Redirect} from 'react-router'
import App             from './components/App/App'
import projectRoutes from './projects/routes.jsx'
import reportsListRoutes from './reports/routes.jsx'

export default (
  <Route path="/" component={ App }>
    // Handle /projects/* routes
    {projectRoutes}
    {reportsListRoutes}
  </Route>
)
