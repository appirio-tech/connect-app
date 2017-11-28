require('./ProjectsToolBar.scss')

import React, {PropTypes, Component} from 'react'
import querystring from 'query-string'
import { withRouter, Prompt } from 'react-router-dom'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'lodash'
import { SearchBar, MenuBar, SwitchButton } from 'appirio-tech-react-components'
import Filters from './Filters'
import NewProjectNavLink from './NewProjectNavLink'

import { projectSuggestions, loadProjects } from '../../projects/actions/loadProjects'


class ProjectsToolBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      errorCreatingProject: false,
      isFilterVisible: false
    }
    this.applyFilters = this.applyFilters.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleMyProjectsFilter = this.handleMyProjectsFilter.bind(this)
    this.onLeave = this.onLeave.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // if new project is created successfully
    if (this.props.creatingProject && !nextProps.creatingProject) {
      if (!nextProps.projectCreationError
        && nextProps.project && nextProps.project.id) {
        this.setState({
          isProjectDirty : false
        }, () => {
          this.props.history.push('/projects/' + nextProps.project.id)
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

  /*eslint-disable no-unused-vars */
  handleTermChange(oldTerm, searchTerm, reqNo, callback) {
    this.props.projectSuggestions(searchTerm)
    callback(reqNo, this.props.projects)
  }
  /*eslint-enable */

  handleSearch(keyword) {
    this.applyFilters({ keyword })
  }

  handleMyProjectsFilter(event) {
    this.applyFilters({memberOnly: event.target.checked})
  }

  applyFilters(filter) {
    const criteria = _.assign({}, this.props.criteria, filter)
    if (criteria && criteria.keyword) {
      criteria.keyword = encodeURIComponent(criteria.keyword)
      // force sort criteria to best match
      criteria.sort = 'best match'
    }
    this.routeWithParams(criteria, 1)
  }

  toggleFilter() {
    const {isFilterVisible} = this.state
    const contentDiv = document.getElementById('wrapper-main')
    this.setState({isFilterVisible: !isFilterVisible}, () => {
      if (this.state.isFilterVisible) {
        contentDiv.classList.add('with-filters')
      } else {
        contentDiv.classList.remove('with-filters')
      }
    })
  }

  routeWithParams(criteria, page) {
    // remove any null values
    criteria = _.pickBy(criteria, _.identity)
    this.props.history.push({
      pathname: '/projects',
      query: '?' + querystring.stringify(_.assign({}, criteria, { page }))
    })
    this.props.loadProjects(criteria, page)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { user, criteria, creatingProject, projectCreationError, searchTermTag } = this.props
    const { errorCreatingProject, isFilterVisible } = this.state
    return nextProps.user.handle !== user.handle
    || JSON.stringify(nextProps.criteria) !== JSON.stringify(criteria)
    || nextProps.creatingProject !== creatingProject
    || nextProps.projectCreationError !== projectCreationError
    || nextProps.searchTermTag !== searchTermTag
    || nextState.errorCreatingProject !== errorCreatingProject
    || nextState.isFilterVisible !== isFilterVisible
  }

  render() {
    const { renderLogoSection, userMenu, userRoles, criteria, isPowerUser } = this.props
    const { isFilterVisible } = this.state
    const isLoggedIn = userRoles && userRoles.length

    let excludedFiltersCount = 1 // 1 for default sort criteria
    if (criteria.memberOnly) {
      // https://github.com/appirio-tech/connect-app/issues/1319
      // The switch should not count as a filter in the menu!
      excludedFiltersCount++
    }
    const noOfFilters = _.keys(criteria).length - excludedFiltersCount
    const onLeaveMessage = this.onLeave() || ''

    const primaryNavigationItems = [
      {
        text: 'My Projects',
        link: '/projects'
      },
      {
        text: 'Getting Started',
        link: 'https://www.topcoder.com/about-topcoder/connect/',
        target: '_blank'
      },
      {
        text: 'Help',
        link: 'https://help.topcoder.com/hc/en-us/articles/225540188-Topcoder-Connect-FAQs',
        target: '_blank'
      }
    ]
    const menuBar = !!isLoggedIn && !isPowerUser && <MenuBar mobileBreakPoint={767} items={primaryNavigationItems} orientation="horizontal" forReactRouter />

    return (
      <div className="ProjectsToolBar">
        <Prompt
            when={!!onLeaveMessage}
            message={onLeaveMessage}
        />
        <div className="primary-toolbar">
          { renderLogoSection(menuBar) }
          {
            !!isLoggedIn &&
            <div className="search-widget">
              { !!isPowerUser &&
                <SearchBar
                  hideSuggestionsWhenEmpty
                  showPopularSearchHeader={ false }
                  searchTermKey="keyword"
                  onTermChange={ this.handleTermChange }
                  onSearch={ this.handleSearch }
                  onClearSearch={ this.handleSearch }
                />
              }
              {
                !!isPowerUser &&
                <div className="search-filter">
                  <a
                    href="javascript:"
                    className={cn('tc-btn tc-btn-sm', {active: isFilterVisible})}
                    onClick={ this.toggleFilter }
                  >Filters { noOfFilters > 0 && <span className="filter-indicator">{ noOfFilters }</span> }</a>
                </div>
              }
            </div>
          }
          <div className="actions">
            { !!isLoggedIn && !!isPowerUser &&
              <div className="primary-filters">
                <div className="tc-switch clearfix">
                  <SwitchButton
                    onChange={ this.handleMyProjectsFilter }
                    label="My projects"
                    name="my-projects-only"
                    checked={criteria.memberOnly}
                  />
                </div>
              </div>
            }
            { !!isLoggedIn && <NewProjectNavLink compact /> }
            { userMenu }
          </div>
        </div>
        <div className="secondary-toolbar">
        { isFilterVisible &&
          <Filters
            applyFilters={ this.applyFilters }
            criteria={ criteria }
          />
        }
        </div>
      </div>
    )
  }
}

ProjectsToolBar.propTypes = {
  criteria              : PropTypes.object.isRequired,
  /**
   * Function which render the logo section in the top bar
   */
  renderLogoSection     : PropTypes.func.isRequired
}

ProjectsToolBar.defaultProps = {
}

// export default ProjectsToolBar

const mapStateToProps = ({ projectSearchSuggestions, searchTerm, projectSearch, projectState, loadUser }) => {
  return {
    projects               : projectSearchSuggestions.projects,
    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag,
    creatingProject        : projectState.processing,
    projectCreationError   : projectState.error,
    project                : projectState.project,
    criteria               : projectSearch.criteria,
    userRoles              : _.get(loadUser, 'user.roles', []),
    user                   : loadUser.user
  }
}

const actionsToBind = { projectSuggestions, loadProjects }

export default withRouter(connect(mapStateToProps, actionsToBind)(ProjectsToolBar))
