import React from 'react'
import Footer from '../Footer/Footer'
import { MAINTENANCE_MODE } from '../../config/constants'
import Alert from 'react-s-alert'
import Maintenance from '../Maintenance/Maintenance'

require('./Layout.scss')

// Alert styles
import '../../styles/vendors/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'

const Layout = (props) => {
  const { isLoadingUser } = props

  if (isLoadingUser) {
    return (<div />)
  } else if (MAINTENANCE_MODE) {
    return <Maintenance />
  } else {
    return (
      <div>
        { props.topbar }
        <Alert stack={{limit: 3, spacing: 30}} position="top" html timeout={4000} offset={0} />
        <div className="main-wrapper" id="wrapper-main">
          { props.content }
        </div>
        <Footer />
      </div>
    )
  }
}

export default Layout
