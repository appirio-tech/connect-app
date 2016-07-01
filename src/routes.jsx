import React from 'react'
import Route from 'react-router/lib/Route'

import App             from './components/App/App'
import Projects    from './components/Projects/Projects'

export default (
  <Route path="/" component={ App }>
    <Route path="projects" component={ Projects } />
  </Route>
)
