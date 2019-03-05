require('./ProjectsToolBar.scss')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import querystring from 'query-string'
import { withRouter, Prompt } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import SearchBar from 'appirio-tech-react-components/components/SearchBar/SearchBar'
import MenuBar from 'appirio-tech-react-components/components/MenuBar/MenuBar'
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdownContainer'
import NewProjectNavLink from './NewProjectNavLink'
import MobileMenu from '../MobileMenu/MobileMenu'
import MobileMenuToggle from '../MobileMenu/MobileMenuToggle'
import { projectSuggestions, loadProjects, setInfiniteAutoload } from '../../projects/actions/loadProjects'
import { loadProjectsMetadata } from '../../actions/templates'
import { getNewProjectLink } from '../../helpers/projectHelper'

class ProjectsToolBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      errorCreatingProject: false,
      isMobileMenuOpen: false,
      isMobileSearchVisible: false
    }
    this.applyFilters = this.applyFilters.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)
    this.onLeave = this.onLeave.bind(this)
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
    const { renderLogoSection, userMenu, userRoles, isPowerUser, user, mobileMenu, location, orgConfig } = this.props
    const { isMobileMenuOpen, isMobileSearchVisible } = this.state
    const isLoggedIn = !!(userRoles && userRoles.length)

    const onLeaveMessage = this.onLeave() || ''

    const primaryNavigationItems = [
      {
        text: 'My Projects',
        link: '/projects'
      },
      {
        text: 'Getting Started',
        link: 'https://www.topcoder.com/about-topcoder/connect/',
        target: '_blank',
        absolute: true
      },
      {
        text: 'Help',
        link: 'https://help.topcoder.com/hc/en-us/articles/225540188-Topcoder-Connect-FAQs',
        target: '_blank',
        absolute: true
      }
    ]
    const menuBar = isLoggedIn && !isPowerUser && <MenuBar mobileBreakPoint={767} items={primaryNavigationItems} orientation="horizontal" forReactRouter />

    return (
      <div className="ProjectsToolBar">
        <Prompt
          when={!!onLeaveMessage}
          message={onLeaveMessage}
        />
        <div className="primary-toolbar">
          { renderLogoSection(menuBar) }
          { isLoggedIn && !isPowerUser && <div className="projects-title-mobile">MY PROJECTS</div> }
          {
            isLoggedIn && !!isPowerUser &&
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
            {isLoggedIn && <NewProjectNavLink compact link={getNewProjectLink(orgConfig)} />}
            { userMenu }
            {/* pass location, to make sure that component is re-rendered when location is changed
                it's necessary to hide notification dropdown on mobile when users uses browser history back/forward buttons */}
            { isLoggedIn && <NotificationsDropdown location={location} /> }
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
