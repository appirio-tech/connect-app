/**
 * App with HOT Reloading
 */
import React from 'react'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { GatewayProvider } from 'react-gateway'
import store  from './config/store'
import Routes from './routes'

const App = () => (
  <Provider store={store}>
    <GatewayProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </GatewayProvider>
  </Provider>
)

export default hot(module)(App)