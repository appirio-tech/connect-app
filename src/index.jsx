import 'babel-polyfill'
import React          from 'react'
import { render }     from 'react-dom'
import { Provider }   from 'react-redux'
import browserHistory from 'react-router/lib/browserHistory'
import Router         from 'react-router/lib/Router'

import store  from './config/store'
import routes from './routes'

const mountNode = document.getElementById('root')

render((
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
), mountNode)
