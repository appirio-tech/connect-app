require('./TopBar.scss')

import React, {PropTypes, Component} from 'react'
import { MenuBar, SearchBar, QuickLinks, UserDropdown,
        ConnectLogo, TopcoderMobileLogo, HamburgerIcon
      } from 'appirio-tech-react-components'

// properties: username, userImage, domain, mobileMenuUrl, mobileSearchUrl, searchSuggestionsFunc
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
    const username = this.props.username
    const userImage = this.props.userImage
    const domain = this.props.domain
    const mobileMenuUrl = this.props.mobileMenuUrl
    const mobileSearchUrl = this.props.mobileSearchUrl
    const homePageUrl = '//www.' + domain
    const isLoggedIn = username ? true : false

    //TODO prepare navigation items according to roles of the user
    const primaryNavigationItems = [
      { 
        //img: require('./nav-projects.svg'),
        text: 'Projects',
        link: '/projects',
        regex: '/projects?\?',
        selected: true
      }
    ]
    const menubar = isLoggedIn
      ? <MenuBar items={primaryNavigationItems} orientation="horizontal" />
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
            <div className="mobile-wrap"><a href={mobileMenuUrl}><HamburgerIcon /></a></div>
            { quickLinks }
            <UserDropdown username={username} userImage={userImage} domain={domain} />
          </div>
        </div>
      </div>
    )
  }
}

TopBar.propTypes = {
  username              : PropTypes.string,
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
