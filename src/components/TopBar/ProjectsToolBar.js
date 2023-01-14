require('./ProjectsToolBar.scss')
/* global tcUniNav */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import querystring from 'query-string'
import { withRouter, Prompt } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import SearchBar from 'appirio-tech-react-components/components/SearchBar/SearchBar'
import NewProjectNavLink from './NewProjectNavLink'
import MobileMenu from '../MobileMenu/MobileMenu'
import MobileMenuToggle from '../MobileMenu/MobileMenuToggle'
import { projectSuggestions, loadProjects, setInfiniteAutoload } from '../../projects/actions/loadProjects'
import { loadProjectsMetadata } from '../../actions/templates'
import { getNewProjectLink } from '../../helpers/projectHelper'
import { hasPermission } from '../../helpers/permissions'
import { PERMISSIONS } from '../../config/permissions'
import { HEADER_AUTH_URLS_HREF, HEADER_AUTH_URLS_LOCATION, DOMAIN } from '../../config/constants'
import { getInitials } from '../../helpers/format'

const HEADER_AUTH_URLS = {
  href: HEADER_AUTH_URLS_HREF,
  location: HEADER_AUTH_URLS_LOCATION
}
const BASE = `https://www.${DOMAIN}`

let uniqueId = 0

class ProjectsToolBar extends Component {

  constructor(props) {
    super(props)
    uniqueId += 1
    this.state = {
      errorCreatingProject: false,
      isMobileMenuOpen: false,
      isMobileSearchVisible: false,
      headerId: uniqueId,
    }
    this.applyFilters = this.applyFilters.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.uniNavInitialized = false
  }

  componentWillMount() {
    const { projectTypes, isProjectTypesLoading, loadProjectsMetadata, criteria } = this.props

    if (!isProjectTypesLoading && !projectTypes) {
      loadProjectsMetadata()
    }

    // update query string if there is a search
    if (criteria && criteria.keyword) {
      this.updateQueryParams(criteria)
    }
  }

  componentWillReceiveProps(nextProps) {
    // if new project is created successfully
    if (this.props.creatingProject && !nextProps.creatingProject) {
      if (!nextProps.projectCreationError
        && nextProps.project && nextProps.project.id) {
        this.setState({
          isProjectDirty : false
        }, () => {
          if (!nextProps.updateExisting) {
            this.props.history.push('/projects/' + nextProps.project.id)
          }
        })
      } else {
        this.setState({
          errorCreatingProject: true
        })
      }
    }
  }

  componentDidMount() {
    // sets window unload hook to show unsaved changes alert and persist incomplete project
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentDidUpdate() {
    if (!!this.state.headerId && !this.uniNavInitialized) {
      const user = this.props.user
      const navigationUserInfo = {
        ...user,
        initials: getInitials(user.firstName, user.lastName)
      }
      const authToken = user ? user.token : null
      this.uniNavInitialized = true
      const headerId = this.state.headerId
      const isAuthenticated = !!authToken
      const authURLs = HEADER_AUTH_URLS

      const regSource = window.location.pathname.split('/')[1]
      const retUrl = encodeURIComponent(window.location.href)
      tcUniNav('init', `headerNav-${headerId}`, {
        type: 'tool',
        toolName: 'Connect',
        toolRoot: '/',
        user: isAuthenticated ? navigationUserInfo : null,
        signOut: () => {
          window.location = `${BASE}/logout?ref=nav`
        },
        signIn: () => {
          window.location = `${authURLs.location
            .replace('%S', retUrl)
            .replace('member?', '#!/member?')}&regSource=${regSource}`
        },
        signUp: () => {
          window.location = `${authURLs.location
            .replace('%S', retUrl)
            .replace('member?', '#!/member?')}&mode=signUp&regSource=${regSource}`
        }
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
    const contentDiv = document.getElementById('wrapper-main')
    contentDiv.classList.remove('with-filters')
  }

  onLeave(e = {}) {
    const { isProjectDirty } = this.state
    const { creatingProject } = this.props
    if (isProjectDirty && !creatingProject) {
      return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    }
  }

  // update query string to match criteria
  updateQueryParams(criteria) {
    // remove any null values
    criteria = _.pickBy(criteria, _.identity)
    this.props.history.push({
      pathname: '/projects',
      search: '?' + querystring.stringify(_.assign({}, criteria))
    })
  }

  /*eslint-disable no-unused-vars */
  handleTermChange(oldTerm, searchTerm, reqNo, callback) {
    callback(reqNo, this.props.projects)
  }
  /*eslint-enable */

  handleSearch(keyword) {
    this.applyFilters({ keyword })
  }

  applyFilters(filter) {
    const criteria = _.assign({}, this.props.criteria, filter)
    if (criteria && criteria.keyword) {
      // force sort criteria to updatedAt desc
      criteria.sort = 'updatedAt desc'
    }
    this.routeWithParams(criteria)
  }

  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen })
  }

  routeWithParams(criteria) {
    // because criteria is changed disable infinite autoload
    this.props.setInfiniteAutoload(false)
    // remove any null values
    criteria = _.pickBy(criteria, _.identity)
    this.props.history.push({
      pathname: '/projects',
      search: '?' + querystring.stringify(_.assign({}, criteria))
    })
    this.props.loadProjects(criteria)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { user, criteria, creatingProject, projectCreationError, searchTermTag, projectTypes } = this.props
    const { errorCreatingProject, isMobileMenuOpen, isMobileSearchVisible } = this.state
    return (nextProps.user || {}).handle !== (user || {}).handle
    || (nextProps.user || {}).photoURL !== (this.props.user || {}).photoURL
    || JSON.stringify(nextProps.criteria) !== JSON.stringify(criteria)
    || nextProps.creatingProject !== creatingProject
    || nextProps.projectCreationError !== projectCreationError
    || nextProps.searchTermTag !== searchTermTag
    || !!nextProps.projectTypes && !projectTypes
    || nextState.errorCreatingProject !== errorCreatingProject
    || nextState.isMobileMenuOpen !== isMobileMenuOpen
    || nextState.isMobileSearchVisible !== isMobileSearchVisible
  }

  render() {
    const { userRoles, user, mobileMenu, orgConfig } = this.props
    const { isMobileMenuOpen, isMobileSearchVisible, headerId } = this.state
    const isLoggedIn = !!(userRoles && userRoles.length)

    const onLeaveMessage = this.onLeave() || ''

    return (
      <div className="ProjectsToolBar">
        <Prompt
          when={!!onLeaveMessage}
          message={onLeaveMessage}
        />
        <div id={`headerNav-${headerId}`} />
        <div className="primary-toolbar">
          { isLoggedIn && !hasPermission(PERMISSIONS.SEARCH_PROJECTS) && <div className="projects-title-mobile">MY PROJECTS</div> }
          {
            isLoggedIn && hasPermission(PERMISSIONS.SEARCH_PROJECTS) &&
            <div className="search-widget">
              <SearchBar
                hideSuggestionsWhenEmpty
                showPopularSearchHeader={ false }
                searchTermKey="keyword"
                onTermChange={ this.handleTermChange }
                onSearch={ this.handleSearch }
                onClearSearch={ this.handleSearch }
              />
            </div>
          }
          <div className="actions">
            {isLoggedIn && <NewProjectNavLink link={getNewProjectLink(orgConfig)} />}
            { isLoggedIn && <MobileMenuToggle onToggle={this.toggleMobileMenu}/> }
          </div>
        </div>
        { isMobileSearchVisible && isLoggedIn &&
          <div className="secondary-toolbar">
            <SearchBar
              hideSuggestionsWhenEmpty
              showPopularSearchHeader={ false }
              searchTermKey="keyword"
              onTermChange={ this.handleTermChange }
              onSearch={ this.handleSearch }
              onClearSearch={ this.handleSearch }
            />
          </div>
        }
        {isMobileMenuOpen && <MobileMenu user={user} onClose={this.toggleMobileMenu} menu={mobileMenu} />}
      </div>
    )
  }
}

ProjectsToolBar.propTypes = {
  criteria              : PropTypes.object.isRequired,
  /**
   * Function which render the logo section in the top bar
   */
  renderLogoSection     : PropTypes.func.isRequired,
  setInfiniteAutoload   : PropTypes.func.isRequired
}

ProjectsToolBar.defaultProps = {
}

// export default ProjectsToolBar

const mapStateToProps = ({ projectSearchSuggestions, searchTerm, projectSearch, projectState, loadUser, templates }) => {
  return {
    projects               : projectSearchSuggestions.projects,
    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag,
    creatingProject        : projectState.processing,
    projectCreationError   : projectState.error,
    project                : projectState.project,
    updateExisting         : projectState.updateExisting,
    criteria               : projectSearch.criteria,
    userRoles              : _.get(loadUser, 'user.roles', []),
    user                   : loadUser.user,
    orgConfig              : loadUser.orgConfig,
    projectTypes      : templates.projectTypes,
    isProjectTypesLoading  : templates.isLoading,
  }
}

const actionsToBind = { projectSuggestions, loadProjects, setInfiniteAutoload, loadProjectsMetadata }

export default withRouter(connect(mapStateToProps, actionsToBind)(ProjectsToolBar))
