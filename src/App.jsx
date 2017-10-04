import React          from 'react'

import browserHistory from 'react-router/lib/browserHistory'
import Router         from 'react-router/lib/Router'

import routes from './routes'
import { TCEmitter } from './helpers'
import { EVENT_ROUTE_CHANGE } from './config/constants'

const onRouteChange = () => {
  TCEmitter.emit(EVENT_ROUTE_CHANGE, window.location.pathname)
}

export default () => (
  <Router history={browserHistory} routes={routes} onUpdate={onRouteChange} />
)
