import React from 'react'
import {Route} from 'react-router'
import App from './components/App/App'
import PageError from './components/PageError/PageError'
import projectRoutes from './projects/routes.jsx'

// import reportsListRoutes from './reports/routes.jsx'

export default (
  <Route path="/" component={ App }>
    {/* Handle /projects/* routes */}
    {projectRoutes}
    {/* {reportsListRoutes} */}

    <Route path="/error" component={ () => <PageError code={500} /> }/>
    <Route path="*" component={ () => <PageError code={404} /> }/>
  </Route>
)
