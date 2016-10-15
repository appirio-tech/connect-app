require('./TopBar.scss')

import React, {PropTypes, Component} from 'react'
import { Link } from 'react-router'
import cn from 'classnames'
import { UserDropdown, Icons } from 'appirio-tech-react-components'

const { ConnectLogoBeta } = Icons
import { SearchBar } from 'appirio-tech-react-components'
import Filters from './Filters'
import ProjectToolBar from './ProjectToolBar'


class TopBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isCreatingProject: false
    }
    this.handleMobileClick = this.handleMobileClick.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleMyProjectsFilter = this.handleMyProjectsFilter.bind(this)
  }

  /*eslint-disable no-unused-vars */
  handleTermChange(oldTerm, searchTerm, reqNo, callback) {
    this.props.projectSuggestions(searchTerm)
    callback(reqNo, this.props.projects)
  }
  /*eslint-enable */

  handleSearch(name) {
    this.props.applyFilters({ name })
  }

  handleMyProjectsFilter(event) {
    this.props.applyFilters({memberOnly: event.target.checked})
  }

  handleMobileClick(se) {
    const mobileMenuLink = se.target.querySelector('.mobile-wrap > a')
    if (mobileMenuLink) {
      mobileMenuLink.click()
    }
  }

  render() {
    const {
      userHandle, userImage, userName, domain, criteria, onNewProjectIntent, applyFilters, isProjectDetails, project,
      isPowerUser, loginUrl, registerUrl, isFilterVisible
    } = this.props
    const homePageUrl = window.location.protocol + '//' + window.location.hostname
    const logoutLink = 'https://accounts.' + domain + '/logout?retUrl=' + homePageUrl
    const isLoggedIn = !!userHandle
    const logoTargetUrl = isLoggedIn ? '/projects' : '/'

    const userMenuItems = [
      [
        { label: 'Help', link: 'https://help.topcoder.com/hc/en-us', absolute: true, id: 0 }
      ],
      [
        { label: 'Log out', link: logoutLink, absolute: true, id: 0 }
      ]
    ]
    const logo = (
      <div className="logo-wrapper">
        <Link className="logo" to={logoTargetUrl}><ConnectLogoBeta /></Link>
      </div>
    )
    const avatar = (
      <div className="welcome-info">
        {isLoggedIn && !isProjectDetails &&  <a onClick={onNewProjectIntent} href="javascript:" className="tc-btn tc-btn-sm tc-btn-primary">+ New Project</a> }
        <div className="avatar-info">
          <div className="links-section">
            <div className="menu-wrap" onClick={this.handleMobileClick}>
              <UserDropdown
                userName={ userName }
                userHandle={userHandle}
                userImage={userImage}
                domain={domain}
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

    if (isProjectDetails) {
      return <ProjectToolBar isPowerUser={isPowerUser} logo={logo} avatar={avatar} project={project} />
    }

    return (
      // <Sticky>
        <div className="tc-header tc-header__connect">
          <div className="top-bar">
            {logo}
            <div className="search-bar">
              {isLoggedIn && <div className="search-widget">
                <SearchBar
                  hideSuggestionsWhenEmpty
                  showPopularSearchHeader={ false }
                  searchTermKey="name"
                  onTermChange={ this.handleTermChange }
                  onSearch={ this.handleSearch }
                  onClearSearch={ this.handleSearch }
                />
              </div>}
              {isPowerUser && <div className="search-filter">
                <a
                  href="javascript:"
                  className={cn('tc-btn tc-btn-sm', {active: isFilterVisible})}
                  onClick={this.props.onToggleFilter}
                >Filters</a>
              </div>}
            </div>
            {avatar}
          </div>
          {isFilterVisible &&
            <Filters
              handleMyProjectsFilter={this.handleMyProjectsFilter}
              applyFilters={applyFilters}
              criteria={criteria}
            />
          }
        </div>
      // </Sticky>
    )
  }
}

TopBar.propTypes = {
  userHandle            : PropTypes.string,
  userImage             : PropTypes.string,
  domain                : PropTypes.string.isRequired,
  mobileMenuUrl         : PropTypes.string,
  mobileSearchUrl       : PropTypes.string,
  criteria              : PropTypes.object.isRequired
}

TopBar.defaultProps = {
  mobileMenuUrl         : '/menu',
  mobileSearchUrl       : '/search'
}

export default TopBar
