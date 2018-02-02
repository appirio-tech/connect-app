import _ from 'lodash'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import store  from './config/store'
import Routes from './routes'
import { SEGMENT_KEY } from './config/constants'

const mountNode = document.getElementById('root')

/* eslint-disable */
if (!_.isEmpty(SEGMENT_KEY)) {
  !!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
  analytics.load(SEGMENT_KEY);
  }}();
}
/* eslint-enable */

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    mountNode
  )
}

renderApp(Routes)

if (module.hot) {
  module.hot.accept('./routes', () => {
    // TODO
    // it has to work without explicit require component
    // but it doesn't update components even though hot reloading is triggered, why?
    const RoutesNew = require('./routes').default

    renderApp(RoutesNew)
  })
}
