import 'babel-polyfill'
import React             from 'react'
import { Provider }      from 'react-redux'
import { BrowserRouter } from 'react-router/lib/Router'

import store  from './config/store'
import Routes from './routes'

export const MemberSearchApp = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>
)
