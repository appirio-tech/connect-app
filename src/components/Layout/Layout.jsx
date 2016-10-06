import _ from 'lodash'
import React from 'react'
import TopBarContainer from '../TopBar/TopBarContainer'
import Footer from '../Footer/Footer'
import { DOMAIN } from '../../config/constants'
import Alert from 'react-s-alert'

require('./Layout.scss')

// Alert styles
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'

const Layout = (props) => {
  const { isLoadingUser, user } = props
  const handle  = _.get(user, 'handle')
  const userImage = _.get(user, 'profile.photoURL')
  const userFirstName = _.get(user, 'profile.firstName')
  const userLastName = _.get(user, 'profile.lastName')
  let userName = userFirstName
  if (userName && userLastName) {
    userName += ' ' + userLastName
  }
  if (isLoadingUser) {
    return (<div />)
  } else {
    return (
      <div>
        <TopBarContainer
          userHandle={ handle }
          userImage={ userImage }
          userName={ userName }
          domain={ DOMAIN }
        />
        <Alert stack={{limit: 3, spacing: 30}} position="top" html timeout={4000} offset={0} />
        <div className="main-wrapper" id="wrapper-main">
          { props.children }
        </div>
        <Footer domain={ DOMAIN } />
      </div>
    )
  }
}

export default Layout
