/**
 * Application starting point
 */
import React from 'react'
import _ from 'lodash'
import { render } from 'react-dom'
import { SEGMENT_KEY, UNIVERSAL_NAV_URL } from './config/constants'
import App from './App'

import 'styles/main.scss'

const mountNode = document.getElementById('root')

/* eslint-disable */
if (!_.isEmpty(SEGMENT_KEY)) {
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.13.1";
  analytics.load(SEGMENT_KEY);
  analytics.page();
  }}();
}
/* eslint-enable */

// <!-- Start of topcoder Topcoder Universal Navigation script -->
/* eslint-disable */
!(function (n, t, e, a, c, i, o) {
// eslint-disable-next-line no-unused-expressions, no-sequences
  ;(n['TcUnivNavConfig'] = c),
  (n[c] =
    n[c] ||
    function () {
      ;(n[c].q = n[c].q || []).push(arguments)
    }),
  (n[c].l = 1 * new Date())
  // eslint-disable-next-line no-unused-expressions, no-sequences
  ;(i = t.createElement(e)), (o = t.getElementsByTagName(e)[0])
  i.crossOrigin="anonymous"
  i.async = 1
  i.type = 'module'
  i.src = a
  o.parentNode.insertBefore(i, o)
})(
  window,
  document,
  'script',
  UNIVERSAL_NAV_URL,
  'tcUniNav'
)
// <!-- End of topcoder Topcoder Universal Navigation script -->
/* eslint-enable */

render(<App />, mountNode)
