import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/App/App'
import Home from './components/Home/Home'
import PageError from './components/PageError/PageError'
import projectRoutes from './projects/routes.jsx'

// import reportsListRoutes from './reports/routes.jsx'

export default (
  <Route path="/" component={ App }>
    <IndexRoute component={Home} />

    {/* Handle /projects/* routes */}
    {projectRoutes}
    {/* {reportsListRoutes} */}

    <Route path="/error" component={ () => <PageError code={500} /> }/>
    <Route path="*" component={ () => <PageError code={404} /> }/>
  </Route>
)
