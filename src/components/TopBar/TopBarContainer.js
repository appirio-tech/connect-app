import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash'
import UserDropdown from 'appirio-tech-react-components/components/UserDropdownMenu/UserDropdownMenu'
import {
  ACCOUNTS_APP_LOGIN_URL,
  DOMAIN,
} from '../../config/constants'
import ConnectLogoMono from '../../assets/icons/connect-logo-mono.svg'
import { getAvatarResized, getFullNameWithFallback } from '../../helpers/tcHelpers.js'
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

    const { user, toolbar, userRoles } = this.props
    const userHandle  = _.get(user, 'handle')
    const bigPhotoURL = _.get(user, 'photoURL')
    const userImage = getAvatarResized(bigPhotoURL, 80)
    const userName = getFullNameWithFallback(user)
    const homePageUrl = `${window.location.protocol}//${window.location.host}/`
    const logoutLink = `${ACCOUNTS_APP_LOGIN_URL}?logout=true&retUrl=${homePageUrl}`
    const isHomePage = this.props.match.path === '/'
    const loginUrl = `${ACCOUNTS_APP_LOGIN_URL}?regSource=tcBusiness&retUrl=${window.location.protocol}//${window.location.host}/`
    const registerUrl = !isHomePage ? loginUrl : null
    const isLoggedIn = !!(userRoles && userRoles.length)

    const logoutClick = (evt) => {
      evt.preventDefault()
      window.analytics && window.analytics.reset()
      window.sessionStorage && window.sessionStorage.clear()
      window.location = logoutLink
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
          { label: 'All projects', link: '/projects?sort=updatedAt%20desc' },
          { label: 'My profile', link: '/settings/profile' },
          { label: 'Account and security', link: '/settings/account' },
          { label: 'Notification settings', link: '/settings/notifications' },
        ]
      }, 
      {
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

const mapStateToProps = ({ loadUser }) => ({
  userRoles              : _.get(loadUser, 'user.roles', []),
  user                   : loadUser.user,
})

const actionsToBind = { }

export default withRouter(connect(mapStateToProps, actionsToBind)(TopBarContainer))
