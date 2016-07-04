import _ from 'lodash'
import React from 'react'
import TopBar from '../TopBar/TopBar'
import { DOMAIN } from '../../config/constants'

require('./Layout.scss')

const Layout = (props) => {
  const { user } = props
  const handle  = _.get(user, 'handle')
  const id  = _.get(user, 'id')
  return (
    <div>
      <TopBar
      username={ handle }
      userImage={ id }
      domain={ DOMAIN } />
      <div className="content-area">
        Sample Page
      </div>
    </div>
  )
}

export default Layout

