import React from 'react'
import {Route} from 'react-router'
import App             from './components/App/App'
import PageError             from './components/PageError/PageError'
import projectRoutes from './projects/routes.jsx'
import reportsListRoutes from './reports/routes.jsx'
import Messages from './Demo3/Messages'
import Dashboard from './Demo3/Dashboard'

export default (
  <Route path="/" component={ App }>
    {/* Handle /projects/* routes */}
    {projectRoutes}
    {reportsListRoutes}

    <Route path="/messages" component={ Messages }/>
    <Route path="/dashboard" component={ Dashboard }/>
    <Route path="/404" component={ () => <PageError code={404} /> }/>
    <Route path="/error" component={ () => <PageError code={500} /> }/>
  </Route>
)
