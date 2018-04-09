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
import TopBarContainer from './components/TopBar/TopBarContainer'
import ProjectsToolBar from './components/TopBar/ProjectsToolBar'
import RedirectComponent from './components/RedirectComponent'
import CreateContainer from './projects/create/containers/CreateContainer'
import CreateContainerMobilePlug from './projects/create/containers/CreateContainerMobilePlug'
import MediaQuery from 'react-responsive'
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator'
import {ACCOUNTS_APP_LOGIN_URL, PROJECT_FEED_TYPE_PRIMARY, PROJECT_FEED_TYPE_MESSAGES } from './config/constants'
import { getTopic } from './api/messages'
import { getFreshToken } from 'tc-accounts'
import { scrollToHash } from './components/ScrollToAnchors.jsx'

import { TCEmitter } from './helpers'
import { EVENT_ROUTE_CHANGE } from './config/constants'

const onRouteChange = (pathname) => {
  TCEmitter.emit(EVENT_ROUTE_CHANGE, pathname)

  if (window.analytics) {
    if (/^projects\/$/.test(pathname)) {
      window.analytics.page('Project Listings')
    } else if (/^projects\/\d+\/?$/.test(pathname)) {
      window.analytics.page('Project Dashboard')
    } else if (/^projects\/\d+\/discussions\/?$/.test(pathname)) {
      window.analytics.page('Project Discussions')
    } else if (/^projects\/\d+\/specification\/?$/.test(pathname)) {
      window.analytics.page('Project Specification')
    } else if (/^\/$/.test(pathname)) {
      window.analytics.page('Connect Home')
    } else if (/^new-project\/$/.test(pathname)) {
      window.analytics.page('New Project : Select Product')
    } else if (/^new-project\/incomplete$/.test(pathname)) {
      window.analytics.page('New Project : Incomplete Project')
    } else if (/^new-project\/[a-zA-Z0-9_]+$/.test(pathname)) {
      window.analytics.page('New Project : Project Details')
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
          if (topic.tag === PROJECT_FEED_TYPE_PRIMARY) {
            history.replace(`/projects/${projectId}/`)
          } else if (topic.tag === PROJECT_FEED_TYPE_MESSAGES) {
            history.replace({
              pathname: `/projects/${projectId}/discussions/${topic.id}`
            })
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

const CreateContainerResponsive = () => (
  <MediaQuery minWidth={768}>
    {(matches) => (matches ? <CreateContainer/> : <CreateContainerMobilePlug/>)}
  </MediaQuery>
)

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
    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (this.props.location.hash !== '') {
        scrollToHash(this.props.location.hash)
      } else {
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
        <Route path="/new-project/:product?/:status?" render={renderApp(null, <CreateContainerResponsive/>)} />
        <Route path="/new-project-callback" render={renderApp(null, <CreateContainerResponsive/>)} />
        <Route path="/terms" render={renderApp(topBarWithProjectsToolBar, <ConnectTerms/>)} />
        <Route path="/login" render={renderApp(topBarWithProjectsToolBar, <LoginRedirect/>)} />
        <Route path="/discussions/:feedId" component={ RedirectToProject } />

        {/* Handle /projects/* routes */}
        {projectRoutes}
        {/* {reportsListRoutes} */}
        {notificationsRoutes}
        {settingsRoutes}

        <Route path="/error" render={renderApp(topBarWithProjectsToolBar, <CoderBot code={500}/>)} />
        <Route path="/404" render={renderApp(topBarWithProjectsToolBar, <CoderBot code={404}/>)} />
        <Route render={renderApp(topBarWithProjectsToolBar, <CoderBot code={404}/>)} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
