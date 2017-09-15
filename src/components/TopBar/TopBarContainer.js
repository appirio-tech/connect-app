import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'
import _ from 'lodash'
import { UserDropdown, Icons } from 'appirio-tech-react-components'
const { ConnectLogo } = Icons
import {
  ACCOUNTS_APP_LOGIN_URL,
  ACCOUNTS_APP_REGISTER_URL,
  DOMAIN
} from '../../config/constants'
require('./TopBarContainer.scss')

class TopBarContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  handleMobileClick(se) {
    const mobileMenuLink = se.target.querySelector('.mobile-wrap > a')
    if (mobileMenuLink) {
      mobileMenuLink.click()
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.user.handle !== this.props.user.handle
    || nextProps.toolbar.type !== this.props.toolbar.type
  }

  render() {
    const { user, userRoles, toolbar } = this.props

    const userHandle  = _.get(user, 'handle')
    const userImage = _.get(user, 'profile.photoURL')
    const userFirstName = _.get(user, 'profile.firstName')
    const userLastName = _.get(user, 'profile.lastName')
    let userName = userFirstName
    if (userName && userLastName) {
      userName += ' ' + userLastName
    }
    const homePageUrl = `${window.location.protocol}//${window.location.host}/`
    const logoutLink = `https://accounts.${DOMAIN}/#!/logout?retUrl=${homePageUrl}`
    const isLoggedIn = userRoles && userRoles.length
    const logoTargetUrl = isLoggedIn ? '/projects' : '/'
    const isHomePage = this.props.router.isActive('/', true)
    // NOTE: hardcoding to connectv2, once connect v1
    window.host
    const loginUrl = `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.host}/`
    const registerUrl = !isHomePage ? ACCOUNTS_APP_REGISTER_URL : null

    const logoutClick = (evt) => {
      evt.preventDefault()
      window.analytics && window.analytics.reset()
      window.location = logoutLink
    }

    const userMenuItems = [
      [
        { label: 'Help', link: 'https://help.topcoder.com/hc/en-us', absolute: true, id: 0 }
      ],
      [
        { label: 'Log out', onClick: logoutClick, absolute: true, id: 0 }
      ]
    ]
    const logo = (
      <div className="logo-wrapper">
        <Link className="logo" to={logoTargetUrl} target="_self"><ConnectLogo /></Link>
      </div>
    )

    const avatar = (
      <div className="welcome-info">
        <div className="avatar-info">
          <div className="links-section">
            <div className="menu-wrap" onClick={this.handleMobileClick}>
              <UserDropdown
                userName={ userName }
                userHandle={userHandle}
                userImage={userImage}
                domain={ DOMAIN }
                menuItems={ userMenuItems }
                loginUrl={ loginUrl }
                registerUrl={ registerUrl }
                forReactRouter
              />
            </div>
          </div>
        </div>
      </div>
    )
    let ToolBar = null
    ToolBar = typeof toolbar === 'function' ? toolbar : null
    ToolBar = toolbar && typeof toolbar.type  === 'function' ? toolbar.type : ToolBar
    return (
      <div className="TopBarContainer">
        <div className="tc-header tc-header__connect">
          <div className="top-bar">
            {
              ToolBar &&
              <ToolBar
                {...this.props}
                logo={ logo }
                userMenu={ avatar }
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ loadUser }) => {
  return {
    userRoles              : _.get(loadUser, 'user.roles', []),
    user                   : loadUser.user
  }
}

const actionsToBind = { }

export default withRouter(connect(mapStateToProps, actionsToBind)(TopBarContainer))
