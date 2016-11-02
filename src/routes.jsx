import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { withProps } from 'recompose'
import App from './components/App/App'
import Home from './components/Home/Home'
import PageError from './components/PageError/PageError'
import projectRoutes from './projects/routes.jsx'
import RedirectComponent from './components/RedirectComponent'
import {ACCOUNTS_APP_LOGIN_URL, PROJECT_FEED_TYPE_PRIMARY, PROJECT_FEED_TYPE_MESSAGES } from './config/constants'
import { getTopic } from './api/messages'

// import reportsListRoutes from './reports/routes.jsx'

const LoginRedirect = withProps({
  redirectTo: `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
})(RedirectComponent)

const redirectToProject = (nextState, replace, callback) => {
  const feedId = nextState.params.feedId
  getTopic(feedId).then(resp => {
    if (resp.topics && resp.topics.length > 0) {
      const topic = resp.topics[0]
      const projectId = topic.referenceId
      if (topic.tag === PROJECT_FEED_TYPE_PRIMARY) {
        replace(`/projects/${projectId}/`)
      } else if (topic.tag === PROJECT_FEED_TYPE_MESSAGES) {
        replace({
          pathname: `/projects/${projectId}/discussions`,
          state: { threadId : topic.id }
        })
      } else {
        replace('/projects')
      }
    }
    callback()
  })
  .catch(error => {
    replace('/projects')
    callback()
  })
}

export default (
  <Route path="/" onUpdate={() => window.scrollTo(0, 0)} component={ App }>
    <IndexRoute component={Home} />
    <Route path="/login" component={LoginRedirect}/>
    <Route path="/discussions/:feedId" onEnter={ redirectToProject } />

    {/* Handle /projects/* routes */}
    {projectRoutes}
    {/* {reportsListRoutes} */}

    <Route path="/error" component={ () => <PageError code={500} /> }/>
    <Route path="*" component={ () => <PageError code={404} /> }/>
  </Route>
)
