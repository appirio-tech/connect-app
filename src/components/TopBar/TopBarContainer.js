import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash'
import UserDropdown from 'appirio-tech-react-components/components/UserDropdownMenu/UserDropdownMenu'
import {
  ACCOUNTS_APP_REGISTER_URL,
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
  ROLE_CONNECT_ACCOUNT_MANAGER,
  DOMAIN,
  ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
  ROLE_PRESALES,
  ROLE_ACCOUNT_EXECUTIVE,
  ROLE_PROJECT_MANAGER,
  ROLE_PROGRAM_MANAGER, ROLE_SOLUTION_ARCHITECT
} from '../../config/constants'
import ConnectLogoMono from '../../assets/icons/connect-logo-mono.svg'
import { getAvatarResized, getFullNameWithFallback } from '../../helpers/tcHelpers.js'
require('./TopBarContainer.scss')
import { login, logout } from 'tc-accounts'

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
    || (nextProps.user || {}).photoURL !== (this.props.user || {}).photoURL
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

    const location = this.props.location.pathname
    if (location && (location.substr(location.lastIndexOf('/') + 1) === 'add-phase')) {
      return (
        <div />
      )
    }
    const { user, toolbar, userRoles, isPowerUser } = this.props
    const userHandle  = _.get(user, 'handle')
    const bigPhotoURL = _.get(user, 'photoURL')
    const userImage = getAvatarResized(bigPhotoURL, 80)
    const userName = getFullNameWithFallback(user)
    const homePageUrl = `${window.location.protocol}//${window.location.host}/`
    const logoutLink = `https://accounts.${DOMAIN}/#!/logout?retUrl=${homePageUrl}`
    const isHomePage = this.props.match.path === '/'
    //const loginUrl = `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.host}/`
    const registerUrl = !isHomePage ? ACCOUNTS_APP_REGISTER_URL : null
    const isLoggedIn = !!(userRoles && userRoles.length)

    const logoutClick = (evt) => {
      evt.preventDefault()
      window.analytics && window.analytics.reset()
      window.sessionStorage && window.sessionStorage.clear()
      //window.location = logoutLink
      logout()
    }

    const loginClick = () => {
      login()
    }

    const userMenuItems = [
      [
        { label: 'My profile', link: '/settings/profile' },
        { label: 'Notification settings', link: '/settings/notifications' },
        { label: 'Account & security', link: '/settings/account' },
      ],
      [
        { label: 'Log out', onClick: logoutClick, absolute: true, id: 0 }
      ]
    ]

    const mobileMenu = [
      {
        style: 'big',
        items: [
          { label: 'All projects', link: isPowerUser ? '/projects?sort=updatedAt%20desc' : '/projects' },
          { label: 'My profile', link: '/settings/profile' },
          { label: 'Account and security', link: '/settings/account' },
          { label: 'Notification settings', link: '/settings/notifications' },
        ]
      }, {
        items: [
          { label: 'About', link: 'https://www.topcoder.com/company/', absolute: true },
          { label: 'Contact us', link: 'https://www.topcoder.com/contact-us/', absolute: true },
          { label: 'Privacy', link: 'https://www.topcoder.com/privacy-policy/', absolute: true },
          { label: 'Terms', link: 'https://connect.topcoder.com/terms', absolute: true },
        ]
      }, {
        items: [
          { label: 'Log Out', link: logoutLink, absolute: true, onClick: logoutClick },
        ]
      }
    ]

    const logInBtn = <div className="login-wrapper"><div className="tc-btn tc-btn-sm tc-btn-default" onClick={loginClick}>Log in</div></div>

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
                loginClick={ loginClick }
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
        <div className="tc-header tc-header__connect" id="TopToolbar">
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
  const roles = [
    ROLE_CONNECT_COPILOT,
    ROLE_CONNECT_MANAGER,
    ROLE_CONNECT_ACCOUNT_MANAGER,
    ROLE_ADMINISTRATOR,
    ROLE_CONNECT_ADMIN,

    ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
    ROLE_PRESALES,
    ROLE_ACCOUNT_EXECUTIVE,
    ROLE_PROJECT_MANAGER,
    ROLE_PROGRAM_MANAGER,
    ROLE_SOLUTION_ARCHITECT,
  ]
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
