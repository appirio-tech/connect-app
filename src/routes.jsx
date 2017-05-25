import React from 'react'
import { Route, IndexRoute, browserHistory } from 'react-router'
import { withProps } from 'recompose'
import App from './components/App/App'
import Home from './components/Home/Home'
import ConnectTerms from './components/ConnectTerms/ConnectTerms'
import CoderBot from './components/CoderBot/CoderBot'
import projectRoutes from './projects/routes.jsx'
import RedirectComponent from './components/RedirectComponent'
import CreateContainer from './projects/create/containers/CreateContainer'
import {ACCOUNTS_APP_LOGIN_URL, PROJECT_FEED_TYPE_PRIMARY, PROJECT_FEED_TYPE_MESSAGES } from './config/constants'
import { getTopic } from './api/messages'
import { getFreshToken } from 'tc-accounts'

// import reportsListRoutes from './reports/routes.jsx'

// Tracking
browserHistory.listen(location => {
  if (window.analytics) {
    if (/^projects\/$/.test(location.pathname)) {
      window.analytics.page('Project Listings')
    } else if (/^projects\/\d+\/?$/.test(location.pathname)) {
      window.analytics.page('Project Dashboard')
    } else if (/^projects\/\d+\/discussions\/?$/.test(location.pathname)) {
      window.analytics.page('Project Discussions')
    } else if (/^projects\/\d+\/specification\/?$/.test(location.pathname)) {
      window.analytics.page('Project Specification')
    } else if (/^\/$/.test(location.pathname)) {
      window.analytics.page('Connect Home')
    }
  }
})

const LoginRedirect = withProps({
  redirectTo: `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
})(RedirectComponent)

const redirectToConnect = (nextState, replace, callback) => {
  if(window.location.hostname.indexOf('connectv2') === 0) {
    window.location.assign(window.location.href.replace('connectv2', 'connect'))
    return
  }
  callback()
}

const redirectToProject = (nextState, replace, callback) => {
  const feedId = nextState.params.feedId
  getFreshToken().then(() => {
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
    .catch(() => {
      replace('/projects')
      callback()
    })
  }).catch(() => {
    // FIXME should we include hash, search etc
    const redirectBackToUrl = window.location.origin + '/' + nextState.location.pathname
    const newLocation = ACCOUNTS_APP_LOGIN_URL + '?retUrl=' + redirectBackToUrl
    window.location = newLocation
  })
}

export default (
  <Route path="/" onUpdate={() => window.scrollTo(0, 0)} component={ App } onEnter={ redirectToConnect }>
    <IndexRoute component={Home} />
    <Route path="/new-project(/type/:type)(/product/:product)" component={CreateContainer} />
    <Route path="/new-project-callback" component={CreateContainer} />
    <Route path="/terms" component={ConnectTerms} />
    <Route path="/login" component={LoginRedirect}/>
    <Route path="/discussions/:feedId" onEnter={ redirectToProject } />

    {/* Handle /projects/* routes */}
    {projectRoutes}
    {/* {reportsListRoutes} */}

    <Route path="/error" component={ () => <CoderBot code={500} /> }/>
    <Route path="*" component={ () => <CoderBot code={404} /> }/>
  </Route>
)
