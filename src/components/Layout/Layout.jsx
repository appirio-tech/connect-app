import _ from 'lodash'
import React from 'react'
import TopBar from '../TopBar/TopBar'
import Footer from '../Footer/Footer'
import { DOMAIN } from '../../config/constants'
import { StickyContainer, Sticky } from 'react-sticky'

require('./Layout.scss')

const Layout = (props) => {
  const { user } = props
  const handle  = _.get(user, 'handle')
  const id  = _.get(user, 'id')
  return (
    <StickyContainer>
      <TopBar
        username={ handle }
        userImage={ id }
        domain={ DOMAIN }
      />
      <div>
        { props.children }
      </div>
      <Footer domain={ DOMAIN } />
    </StickyContainer>
  )
}

export default Layout

