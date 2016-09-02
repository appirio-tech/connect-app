require('./TopBar.scss')

import React, {PropTypes, Component} from 'react'
import { MenuBar, QuickLinks, UserDropdown, Icons
      } from 'appirio-tech-react-components'
const { TopcoderMobileLogo, IconTcMenuBold, ConnectLogo } = Icons

// properties: userHandle, userName, userImage, domain, mobileMenuUrl, mobileSearchUrl, searchSuggestionsFunc
// searchSuggestionsFunc should return a Promise object

class TopBar extends Component {

  constructor(props) {
    super(props)
    this.handleMobileClick = this.handleMobileClick.bind(this)
  }

  handleMobileClick(se) {
    const mobileMenuLink = se.target.querySelector('.mobile-wrap > a')
    if (mobileMenuLink) {
      mobileMenuLink.click()
    }
  }

  render() {
    const { userHandle, userImage, userName, domain, mobileMenuUrl } = this.props
    const homePageUrl = window.location.protocol + '//' + window.location.hostname
    const logoutLink = 'https://accounts.' + domain + '/logout?retUrl=' + homePageUrl
    const isLoggedIn = userHandle

    //TODO prepare navigation items according to roles of the user
    const primaryNavigationItems = [
      {
        //img: require('./nav-projects.svg'),
        text: 'Projects',
        link: '/projects',
        regex: '/projects?\?'
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Reports',
        link: '/reports',
        regex: '/reports?\?'
      }
    ]
    const userMenuItems = [
      [
        { label: 'My Profile', link: '/profile/' + userHandle, id: 0 },
        { label: 'Settings', link: '/settings/profile', id: 1 }
      ],
      [
        { label: 'Help', link: '//help.' + domain, absolute: true, id: 0 }
      ],
      [
        { label: 'Log out', link: logoutLink, absolute: true, id: 0 }
      ]
    ]
    const menubar = isLoggedIn
      ? <MenuBar forReactRouter items={primaryNavigationItems} orientation="horizontal" />
      : null
    const quickLinks = isLoggedIn ?
      <div className="quick-links-wrap"><QuickLinks domain={domain} /></div>
      : null
    return (
      <div className="TopBar flex middle space-between">
        <div className="topcoder-logo non-mobile">
          <a href={homePageUrl}><ConnectLogo width={155}/></a>
        </div>
        <div className="topcoder-logo mobile">
          <a href={homePageUrl}><TopcoderMobileLogo width={40} /></a>
        </div>
        <div className="links-section">
          { menubar }
          <div className="menu-wrap" onClick={this.handleMobileClick}>
            <div className="mobile-wrap"><a href={mobileMenuUrl}><IconTcMenuBold /></a></div>
            { quickLinks }
            <UserDropdown userName={ userName } userHandle={userHandle} userImage={userImage} domain={domain} menuItems={ userMenuItems } forReactRouter/>
          </div>
        </div>
      </div>
    )
  }
}

TopBar.propTypes = {
  userHandle            : PropTypes.string,
  userImage             : PropTypes.string,
  domain                : PropTypes.string.isRequired,
  mobileMenuUrl         : PropTypes.string,
  mobileSearchUrl       : PropTypes.string
}

TopBar.defaultProps = {
  mobileMenuUrl         : '/menu',
  mobileSearchUrl       : '/search'
}

export default TopBar
