import 'babel-polyfill'
import React          from 'react'
import { render }     from 'react-dom'
import { Provider }   from 'react-redux'

import _ from 'lodash'
import store  from './config/store'
import { SEGMENT_KEY } from './config/constants'
import App from './App'

const mountNode = document.getElementById('root')

/* eslint-disable */
if (!_.isEmpty(SEGMENT_KEY)) {
  !!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
  analytics.load(SEGMENT_KEY);
  }}();
}

/* eslint-enable */

const renderApp = (AppComponent) => {
  render((
    <Provider store={store}>
      <AppComponent />
    </Provider>
  ), mountNode)
}

renderApp(App)

/**
 * Warning from React Router, caused by react-hot-loader.
 * The warning can be safely ignored, so filter it from the console.
 * Otherwise you'll see it every time something changes.
 * See https://github.com/gaearon/react-hot-loader/issues/298
 *
 * I think if update to react-router it has to disappear
 */
if (module.hot) {
  const isString = (str) => typeof str === 'string'
  const orgError = console.error // eslint-disable-line no-console
  console.error = (...args) => { // eslint-disable-line no-console
    if (args && args.length === 1 && isString(args[0]) && args[0].indexOf('You cannot change <Router routes>;') > -1) {
      // React route changed
    } else {
      // Log the error as normally
      orgError.apply(console, args)
    }
  }

  module.hot.accept('./App', () => {
    const AppComponent = require('./App').default

    renderApp(AppComponent)
  })
}
