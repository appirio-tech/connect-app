import 'babel-polyfill'
import React          from 'react'
import { render }     from 'react-dom'
import { Provider }   from 'react-redux'
import browserHistory from 'react-router/lib/browserHistory'
import Router         from 'react-router/lib/Router'

import store  from './config/store'
import routes from './routes'
import { TCEmitter } from './helpers'
import { EVENT_ROUTE_CHANGE } from './config/constants'

const mountNode = document.getElementById('root')
const onRouteChange = () => {
  TCEmitter.emit(EVENT_ROUTE_CHANGE, window.location.pathname)
}

render((
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} onUpdate={onRouteChange} />
  </Provider>
), mountNode)
