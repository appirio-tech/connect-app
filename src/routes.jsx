import React from 'react'
import { Route, IndexRoute, browserHistory } from 'react-router'
import { withProps } from 'recompose'
import App from './components/App/App'
import Home from './components/Home/Home'
import ConnectTerms from './components/ConnectTerms/ConnectTerms'
import CoderBot from './components/CoderBot/CoderBot'
import projectRoutes from './projects/routes.jsx'
import TopBarContainer from './components/TopBar/TopBarContainer'
import ProjectsToolBar from './components/TopBar/ProjectsToolBar'
import RedirectComponent from './components/RedirectComponent'
import CreateContainer from './projects/create/containers/CreateContainer'
import { findCategory, findProductCategory } from './config/projectWizard'
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
    } else if (/^new-project\/$/.test(location.pathname)) {
      window.analytics.page('New Project : Select Product')
    } else if (/^new-project\/incomplete$/.test(location.pathname)) {
      window.analytics.page('New Project : Incomplete Project')
    } else if (/^new-project\/[a-zA-Z0-9\_]+$/.test(location.pathname)) {
      window.analytics.page('New Project : Project Details')
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
            pathname: `/projects/${projectId}/discussions/${topic.id}`
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

const validateCreateProjectParams = (nextState, replace, callback) => {
  const product = nextState.params.product
  // first try the path param to be a project category
  let productCategory = findCategory(product)
  // if it is not a category, it should be a product and we should be able to find a category for it
  productCategory = !productCategory ? findProductCategory(product) : productCategory
  if (product && product.trim().length > 0 && !productCategory) {
    // workaround to add URL for incomplete project confirmation step
    // ideally we should have better URL naming which resolves each route with distinct patterns
    if (product !== 'incomplete') {
      replace('/404')
    }
  }
  callback()
}

const renderTopBarWithProjectsToolBar = (props) => <TopBarContainer toolbar={ ProjectsToolBar } route={props.route} />

export default (
  <Route path="/" onUpdate={() => window.scrollTo(0, 0)} component={ App } onEnter={ redirectToConnect }>
    <IndexRoute components={{ topbar: renderTopBarWithProjectsToolBar, content: Home }} />
    <Route path="/new-project(/:product)" components={{ topbar: null, content: CreateContainer }} onEnter={ validateCreateProjectParams } />
    <Route path="/new-project-callback" components={{ topbar: null, content: CreateContainer }} />
    <Route path="/terms" components={{ topbar: renderTopBarWithProjectsToolBar, content: ConnectTerms }}  />
    <Route path="/login" components={{ topbar: renderTopBarWithProjectsToolBar, content: LoginRedirect }} />
    <Route path="/discussions/:feedId" onEnter={ redirectToProject } />

    {/* Handle /projects/* routes */}
    {projectRoutes}
    {/* {reportsListRoutes} */}

    <Route path="/error" components={{ topbar: renderTopBarWithProjectsToolBar, content: () => <CoderBot code={500} /> }} />
    <Route path="/404" components={{ topbar: renderTopBarWithProjectsToolBar, content: () => <CoderBot code={404} /> }} />
    <Route path="*" components={{ topbar: renderTopBarWithProjectsToolBar, content: () => <CoderBot code={404} /> }} />
  </Route>
)
