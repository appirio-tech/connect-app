import _ from 'lodash'
import React from 'react'
import { NavBar, Panel } from 'appirio-tech-react-components'
import { DOMAIN } from '../../config/constants'

require('./Layout.scss')

const Layout = (props) => {
  const { user } = props
  const handle  = _.get(user, 'handle')
  const id  = _.get(user, 'id')
  return (
    <div>
      <NavBar
      username={ handle }
      userImage={ id }
      domain={ DOMAIN }
      searchSuggestionsFunc={ props.loadSearchSuggestions  }
      onSearch={ props.search } />
      <Panel>
        <div className="panel-header">
          Header
          <a className="expand-trigger">Click Me</a>
        </div>

        <div className="panel-body">
          Body
        </div>
      </Panel>
    </div>
  )
}

export default Layout

