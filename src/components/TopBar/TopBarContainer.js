import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash'
import UserDropdown from 'appirio-tech-react-components/components/UserDropdownMenu/UserDropdownMenu'
import {
  ACCOUNTS_APP_LOGIN_URL,
  ACCOUNTS_APP_REGISTER_URL,
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
  DOMAIN
} from '../../config/constants'
import ConnectLogoMono from '../../assets/icons/connect-logo-mono.svg'
require('./TopBarContainer.scss')


class TopBarContainer extends React.Component {

  constructor(props) {
    super(props)
    this.renderLogo = this.renderLogo.bind(this)
  }

  handleMobileClick(se) {
    const mobileMenuLink = se.target.querySelector('.mobile-wrap > a')
    if (mobileMenuLink) {
      mobileMenuLink.click()
    }
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.user || {}).handle !== (this.props.user || {}).handle
    || nextProps.toolbar !== this.props.toolbar
    || this.props.location.pathname !== nextProps.location.pathname
  }

  renderLogo(comp){
    const { userRoles } = this.props
    const isLoggedIn = userRoles && userRoles.length
    const logoTargetUrl = isLoggedIn ? '/projects' : '/'
    return (
      <div className="logo-wrapper">
        <Link className="logo" to={logoTargetUrl} target="_self">
          <ConnectLogoMono className="icon-connect-logo-mono" title="Connect" />
        </Link>
        {comp}
      </div>
    )
  }

  render() {
    const { user, toolbar, userRoles } = this.props

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
    const isHomePage = this.props.match.path === '/'
    const loginUrl = `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.host}/`
    const registerUrl = !isHomePage ? ACCOUNTS_APP_REGISTER_URL : null
    const profileUrl = `https://${DOMAIN}/settings/profile/`
    const isLoggedIn = !!(userRoles && userRoles.length)

    const logoutClick = (evt) => {
      evt.preventDefault()
      window.analytics && window.analytics.reset()
      window.sessionStorage && window.sessionStorage.clear()
      window.location = logoutLink
    }

    const userMenuItems = [
      [
        { label: 'Profile Settings', link: profileUrl, absolute: true, id: 0},
        { label: 'Help', link: 'https://help.topcoder.com/hc/en-us', absolute: true, id: 0 }
      ],
      [
        { label: 'Log out', onClick: logoutClick, absolute: true, id: 0 }
      ]
    ]

    const mobileMenu = [
      {
        style: 'big',
        items: [
          { label: 'My projects', link: '/projects?sort=updatedAt%20desc&status=active' },
          { label: 'Getting Started', link: 'https://www.topcoder.com/about-topcoder/connect/', absolute: true },
          { label: 'Help', link: 'https://help.topcoder.com/hc/en-us', absolute: true },
        ]
      }, {
        items: [
          { label: 'About', link: 'https://www.topcoder.com/about-topcoder/', absolute: true },
          { label: 'Contacts', link: 'https://www.topcoder.com/about-topcoder/contact/', absolute: true },
          { label: 'Privacy', link: 'https://www.topcoder.com/community/how-it-works/privacy-policy/', absolute: true },
          { label: 'Terms', link: 'https://connect.topcoder.com/terms', absolute: true },
        ]
      }, {
        items: [
          { label: 'Log Out', link: logoutLink, absolute: true, onClick: logoutClick },
        ]
      }
    ]

    const logInBtn = <div className="login-wrapper"><a className="tc-btn tc-btn-sm tc-btn-default" href={loginUrl}>Log in</a></div>

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
                renderLogoSection={ this.renderLogo }
                userMenu={ isLoggedIn ? avatar : logInBtn }
                mobileMenu={mobileMenu}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ loadUser }) => {
  let isPowerUser = false
  const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  if (loadUser.user) {
    isPowerUser = loadUser.user.roles.some((role) => roles.indexOf(role) !== -1)
  }
  return {
    userRoles              : _.get(loadUser, 'user.roles', []),
    user                   : loadUser.user,
    isPowerUser
  }
}

const actionsToBind = { }

export default withRouter(connect(mapStateToProps, actionsToBind)(TopBarContainer))
