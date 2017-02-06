import 'babel-polyfill'
import React          from 'react'
import { render }     from 'react-dom'
import { Provider }   from 'react-redux'
import browserHistory from 'react-router/lib/browserHistory'
import Router         from 'react-router/lib/Router'

import store  from './config/store'
import routes from './routes'
import { TCEmitter } from './helpers'
import { EVENT_ROUTE_CHANGE, SEGMENT_KEY } from './config/constants'

const mountNode = document.getElementById('root')
const onRouteChange = () => {
  TCEmitter.emit(EVENT_ROUTE_CHANGE, window.location.pathname)
}

/* eslint-disable */
if (SEGMENT_KEY) {
  !!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
  analytics.load(SEGMENT_KEY);
  analytics.page();
  // analytics.debug()
  }}();
}

/* eslint-enable */

render((
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} onUpdate={onRouteChange} />
  </Provider>
), mountNode)
