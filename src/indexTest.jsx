import 'babel-polyfill'
import React          from 'react'
import { Provider }   from 'react-redux'
import browserHistory from 'react-router/lib/browserHistory'
import Router         from 'react-router/lib/Router'

import store  from './config/store'
import routes from './routes'

export const MemberSearchApp = () => (
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
)
