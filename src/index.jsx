import 'babel-polyfill'
import React          from 'react'
import { render }     from 'react-dom'
import { Provider }   from 'react-redux'
import browserHistory from 'react-router/lib/browserHistory'
import Router         from 'react-router/lib/Router'

import store  from './config/store'
import routes from './routes'
import { TCEmitter } from './helpers'
import { EVENT_ROUTE_CHANGE, HEAP_ANALYTICS_APP_ID } from './config/constants'

const mountNode = document.getElementById('root')
const onRouteChange = () => {
  TCEmitter.emit(EVENT_ROUTE_CHANGE, window.location.pathname)
}

/* eslint-disable */
window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
heap.load(HEAP_ANALYTICS_APP_ID);
/* eslint-enable */

render((
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} onUpdate={onRouteChange} />
  </Provider>
), mountNode)
