import React from 'react'
import Footer from '../Footer/Footer'
import { MAINTENANCE_MODE } from '../../config/constants'
import Alert from 'react-s-alert'
import cn from 'classnames'
import { GatewayDest } from 'react-gateway'
import Maintenance from '../Maintenance/Maintenance'

require('./Layout.scss')

// Alert styles
import '../../styles/vendors/s-alert-default.scss'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'

const Layout = (props) => {
  const { isLoadingUser, maintenanceMode } = props

  if (isLoadingUser) {
    return (<div />)
  } else if (MAINTENANCE_MODE === true || maintenanceMode) {
    return <Maintenance />
  } else {
    return (
      <div>
        { props.topbar }
        <Alert stack={{limit: 3, spacing: 30}} position="bottom-left" html timeout={4000} offset={50} effect="stackslide" />
        <div className={cn('main-wrapper')} data-route={window.location.pathname.replace(/\//g, '__')} id="wrapper-main">
          { props.content }
        </div>
        <Footer />
        <GatewayDest name="fullscreen-page" className="mobile-page-gateway" />
      </div>
    )
  }
}

export default Layout
