import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import _ from 'lodash'
import { UserDropdown, Icons, MenuBar } from 'appirio-tech-react-components'
const { ConnectLogo } = Icons
import {
  ACCOUNTS_APP_LOGIN_URL,
  ACCOUNTS_APP_REGISTER_URL,
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_ADMINISTRATOR,
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
    return (nextProps.user || {}).handle !== (this.props.user || {}).handle
    || nextProps.toolbar !== this.props.toolbar
    || this.props.location.pathname !== nextProps.location.pathname
  }

  render() {
    const { user, userRoles, toolbar, isPowerUser } = this.props

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
    const isHomePage = this.props.match.path === '/'
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

    const primaryNavigationItems = [
      {
        text: 'My Projects',
        link: '/projects'
      },
      {
        text: 'Getting Started',
        link: `https://www.${DOMAIN}/about-topcoder/connect/`,
        target: '_blank'
      },
      {
        text: 'Help',
        link: 'https://help.topcoder.com/hc/en-us/articles/225540188-Topcoder-Connect-FAQs',
        target: '_blank'
      }
    ]
    const logo = (
      <div className="logo-wrapper">
        <Link className="logo" to={logoTargetUrl} target="_self"><ConnectLogo /></Link>
        { !isPowerUser && <MenuBar items={primaryNavigationItems} orientation="horizontal" forReactRouter />}
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
  let isPowerUser = false
  const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR]
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
