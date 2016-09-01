import _ from 'lodash'
import React from 'react'
import TopBar from '../TopBar/TopBar'
import Footer from '../Footer/Footer'
import { DOMAIN } from '../../config/constants'
import { StickyContainer } from 'react-sticky'
import Alert from 'react-s-alert'

require('./Layout.scss')

// Alert styles
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'

const Layout = (props) => {
  const { isLoadingUser, user } = props
  const handle  = _.get(user, 'handle')
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
      <Alert stack={{limit: 3}} html timeout={4000} offset={50} />
        <div>
          { props.children }
        </div>
        <Footer domain={ DOMAIN } />
      </StickyContainer>
    )
  }
}

export default Layout
