import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { withProps } from 'recompose'
import App from './components/App/App'
import Home from './components/Home/Home'
import PageError from './components/PageError/PageError'
import projectRoutes from './projects/routes.jsx'
import RedirectComponent from './components/RedirectComponent'
import {ACCOUNTS_APP_LOGIN_URL} from './config/constants'

// import reportsListRoutes from './reports/routes.jsx'

const LoginRedirect = withProps({
  redirectTo: `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.hostname}${window.location.port ? ":" + window.location.port : ''}`
})(RedirectComponent)

export default (
  <Route path="/" onUpdate={() => window.scrollTo(0, 0)} component={ App }>
    <IndexRoute component={Home} />
    <Route path="/login" component={LoginRedirect}/>

    {/* Handle /projects/* routes */}
    {projectRoutes}
    {/* {reportsListRoutes} */}

    <Route path="/error" component={ () => <PageError code={500} /> }/>
    <Route path="*" component={ () => <PageError code={404} /> }/>
  </Route>
)
