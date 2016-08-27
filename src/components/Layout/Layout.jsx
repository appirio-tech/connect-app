import _ from 'lodash'
import React from 'react'
import TopBar from '../TopBar/TopBar'
import Footer from '../Footer/Footer'
import { DOMAIN } from '../../config/constants'
import { StickyContainer } from 'react-sticky'

require('./Layout.scss')

const Layout = (props) => {
  const { isLoadingUser, user } = props
  const handle  = _.get(user, 'handle')
  const id  = _.get(user, 'id')
  const userImage = _.get(user, 'profile.photoURL')
  if (isLoadingUser) {
    return (<div></div>)
  } else {
    return (
      <StickyContainer>
        <TopBar
          username={ handle }
          userImage={ userImage }
          domain={ DOMAIN }
        />
        <div>
          { props.children }
        </div>
        <Footer domain={ DOMAIN } />
      </StickyContainer>
    )
  }
}

export default Layout
