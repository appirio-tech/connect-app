import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { withProps } from 'recompose'
import { renderApp } from './components/App/App'
import Home from './components/Home/Home'
import ConnectTerms from './components/ConnectTerms/ConnectTerms'
import CoderBot from './components/CoderBot/CoderBot'
import projectRoutes from './projects/routes.jsx'
import notificationsRoutes from './routes/notifications/routes.jsx'
import settingsRoutes from './routes/settings/routes.jsx'
import metaDataRoutes from './routes/metadata/routes.jsx'
import reportsListRoutes from './routes/reports/routes'
import faqsRoute from './routes/faqs/routes'
import TopBarContainer from './components/TopBar/TopBarContainer'
import ProjectsToolBar from './components/TopBar/ProjectsToolBar'
import RedirectComponent from './components/RedirectComponent'
import CreateContainer from './projects/create/containers/CreateContainer'
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator'
import OrganizationPage from './components/SpecialPage/OrganizationPage'
import {ACCOUNTS_APP_LOGIN_URL, PROJECT_FEED_TYPE_PRIMARY, PROJECT_FEED_TYPE_MESSAGES } from './config/constants'
import { getTopic } from './api/messages'
import { getFreshToken } from '@topcoder-platform/tc-auth-lib'
import { scrollToHash } from './components/ScrollToAnchors.jsx'

import { TCEmitter } from './helpers'
import { EVENT_ROUTE_CHANGE } from './config/constants'

const onRouteChange = (pathname) => {
  TCEmitter.emit(EVENT_ROUTE_CHANGE, pathname)

  if (window.analytics) {
    if (/^\/projects\/$/.test(pathname)) {
      window.analytics.page('Project Listings')
    } else if (/^\/projects\/\d+\/?$/.test(pathname)) {
      window.analytics.page('Project Dashboard')
    } else if (/^\/projects\/\d+\/discussions\/?$/.test(pathname)) {
      window.analytics.page('Project Discussions')
    } else if (/^\/projects\/\d+\/specification\/?$/.test(pathname)) {
      window.analytics.page('Project Specification')
    } else if (/^\/projects\/\d+\/scope\/?$/.test(pathname)) {
      window.analytics.page('Project Scope')
    } else if (/^\/projects\/\d+\/plan\/?$/.test(pathname)) {
      window.analytics.page('Project Plan')
    }  else if (/^\/projects\/\d+\/assets\/?$/.test(pathname)) {
      window.analytics.page('Assets Library')
    } else if (/^\/settings\/notifications\/?$/.test(pathname)) {
      window.analytics.page('Notification Settings')
    } else if (/^\/notifications\/?$/.test(pathname)) {
      window.analytics.page('Notification Listings')
    } else if (/^\/$/.test(pathname)) {
      window.analytics.page('Connect Home')
    } else if (/^\/organization\/new-project\/$/.test(pathname)) {
      window.analytics.page('New Organization Project')
    } else if (/^\/new-project\/$/.test(pathname)) {
      window.analytics.page('New Project : Select Project Category')
    } else if (/^\/new-project\/incomplete$/.test(pathname)) {
      window.analytics.page('New Project : Incomplete Project')
    } else if (/^\/new-project\/[a-zA-Z0-9_-]+$/.test(pathname)) {
      window.analytics.page('New Project : Project Template/Details')
    }
  }
}

const redirectToConnectIfNeed = () => {
  if (window.location.hostname.indexOf('connectv2') === 0) {
    window.location.assign(window.location.href.replace('connectv2', 'connect'))
    return
  }
}

const LoginRedirect = withProps({
  redirectTo: `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
})(RedirectComponent)

class RedirectToProject extends React.Component {
  componentWillMount() {
    const { match, history } = this.props
    const feedId = match.params.feedId
    getFreshToken().then(() => {
      getTopic(feedId).then(resp => {
        if (resp.topic) {
          const topic = resp.topic
          const projectId = topic.referenceId
          if (topic.tag === PROJECT_FEED_TYPE_PRIMARY || topic.tag === PROJECT_FEED_TYPE_MESSAGES) {
            history.replace(`/projects/${projectId}/messages/${topic.id}`)
          } else {
            history.replace('/projects')
          }
        }
      })
        .catch(() => {
          history.replace('/projects')
        })
    }).catch(() => {
      // FIXME should we include hash, search etc
      const redirectBackToUrl = window.location.origin + '/' + match.location.pathname
      const newLocation = ACCOUNTS_APP_LOGIN_URL + '?retUrl=' + redirectBackToUrl
      window.location = newLocation
    })
  }

  render() {
    return <LoadingIndicator />
  }
}

const topBarWithProjectsToolBar = <TopBarContainer toolbar={ ProjectsToolBar } />

class Routes extends React.Component {
  componentWillMount() {
    redirectToConnectIfNeed()
  }

  componentDidMount() {
    const pathname = this.props.location.pathname
    onRouteChange(pathname)
  }

  componentWillReceiveProps(nextProps) {
    const currentPathname = this.props.location.pathname
    const nextPathname = nextProps.location.pathname

    if (currentPathname !== nextPathname) {
      onRouteChange(nextPathname)
    }
  }

  componentDidUpdate(prevProps) {
    const messagesRouteRegExp = /projects\/\d+\/messages/
    const navigateBetweenMessages = prevProps.location.pathname.match(messagesRouteRegExp) &&
      this.props.location.pathname.match(messagesRouteRegExp)

    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (this.props.location.hash !== '') {
        scrollToHash(this.props.location.hash)

      // don't scroll to the top when open/close a drawer with messages
      } else if (!navigateBetweenMessages) {
        window.scrollTo(0, 0)
      }
    } else if (this.props.location.hash !== prevProps.location.hash && this.props.location.hash !== '') {
      scrollToHash(this.props.location.hash)
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" render={renderApp(topBarWithProjectsToolBar, <Home/>)} />
        <Route path="/organization/new-project" render={renderApp(null, <OrganizationPage/>)} />
        <Route path="/new-project/:project?/:status?" render={renderApp(null, <CreateContainer/>)} />
        <Route path="/new-project-callback" render={renderApp(null, <CreateContainer/>)} />
        <Route path="/terms" render={renderApp(topBarWithProjectsToolBar, <ConnectTerms/>)} />
        <Route path="/login" render={renderApp(topBarWithProjectsToolBar, <LoginRedirect/>)} />
        <Route path="/discussions/:feedId" component={ RedirectToProject } />

        {/* Handle /projects/* routes */}
        {projectRoutes}
        {reportsListRoutes}
        {faqsRoute}
        {notificationsRoutes}
        {settingsRoutes}
        {metaDataRoutes}

        <Route path="/error" render={renderApp(topBarWithProjectsToolBar, <CoderBot code={500}/>)} />
        <Route path="/404" render={renderApp(topBarWithProjectsToolBar, <CoderBot code={404}/>)} />
        <Route render={renderApp(topBarWithProjectsToolBar, <CoderBot code={404}/>)} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
