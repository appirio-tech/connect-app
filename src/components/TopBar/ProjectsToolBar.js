require('./ProjectsToolBar.scss')

import React, {PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'lodash'
import Modal from 'react-modal'
import { SearchBar } from 'appirio-tech-react-components'
import Filters from './Filters'

import ModalControl from '../ModalControl'
import SVGIconImage from '../SVGIconImage'
import CoderBot from '../CoderBot/CoderBot'
import ProjectWizard from '../../projects/create/components/ProjectWizard'

import { createProjectWithStatus as createProjectAction } from '../../projects/actions/project'
import { projectSuggestions, loadProjects } from '../../projects/actions/loadProjects'
import {
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_ADMINISTRATOR,
  PROJECT_STATUS_IN_REVIEW
} from '../../config/constants'


class ProjectsToolBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isCreateProjectModalVisible : false,
      errorCreatingProject: false,
      isFilterVisible: false
    }
    this.applyFilters = this.applyFilters.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.showCreateProjectDialog = this.showCreateProjectDialog.bind(this)
    this.hideCreateProjectDialog = this.hideCreateProjectDialog.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleMyProjectsFilter = this.handleMyProjectsFilter.bind(this)
    this.createProject = this.createProject.bind(this)
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
          this.hideCreateProjectDialog()
          this.props.router.push('/projects/' + nextProps.project.id)
        })
      } else {
        this.setState({
          errorCreatingProject: true
        })
      }
    }
  }

  componentDidMount() {
    const { router, route } = this.props
    // sets route leave hook to show unsaved changes alert and persist incomplete project
    this.routeLeaveHook = router.setRouteLeaveHook(route, this.onLeave)

    // sets window unload hook to show unsaved changes alert and persist incomplete project
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
    if (this.routeLeaveHook) {
      this.routeLeaveHook()
    }
    const contentDiv = document.getElementById('wrapper-main')
    contentDiv.classList.remove('with-filters')
  }

  onLeave(e) {
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

  showCreateProjectDialog() {
    this.setState({
      isCreateProjectModalVisible : true
    })
  }

  hideCreateProjectDialog() {
    let confirm = true
    if (this.state.isProjectDirty) {
      confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?')
    }
    if (confirm === true) {
      this.setState({
        isProjectDirty: false,
        isCreateProjectModalVisible : false,
        errorCreatingProject: false
      })
    }
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
    this.props.router.push({
      pathname: '/projects/',
      query: _.assign({}, criteria, { page })
    })
    this.props.loadProjects(criteria, page)
  }

  createProject(project) {
    this.props.createProjectAction(project, PROJECT_STATUS_IN_REVIEW)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { user, criteria, creatingProject, projectCreationError, searchTermTag } = this.props
    const { isCreateProjectModalVisible, errorCreatingProject, isFilterVisible } = this.state
    return nextProps.user.handle !== user.handle
    || JSON.stringify(nextProps.criteria) !== JSON.stringify(criteria)
    || nextProps.creatingProject !== creatingProject
    || nextProps.projectCreationError !== projectCreationError
    || nextProps.searchTermTag !== searchTermTag
    || nextState.isCreateProjectModalVisible !== isCreateProjectModalVisible
    || nextState.errorCreatingProject !== errorCreatingProject
    || nextState.isFilterVisible !== isFilterVisible
  }

  render() {
    const { logo, userMenu, userRoles, criteria, isPowerUser } = this.props
    const { isCreateProjectModalVisible, errorCreatingProject, isFilterVisible } = this.state
    const isLoggedIn = userRoles && userRoles.length

    const noOfFilters = _.keys(criteria).length - 1 // -1 for default sort criteria

    return (
      <div className="ProjectsToolBar">
        <Modal
          isOpen={ isCreateProjectModalVisible }
          className="project-creation-dialog"
          overlayClassName="project-creation-dialog-overlay"
          onRequestClose={ this.hideCreateProjectDialog }
          contentLabel=""
        >
          <ModalControl
            className="escape-button"
            icon={<SVGIconImage filePath="x-mark" />}
            label="esc"
            onClick={ this.hideCreateProjectDialog }
          />
          { !errorCreatingProject &&
            <ProjectWizard
              showModal={ false }
              processing={ this.props.creatingProject }
              createProject={ this.createProject }
              closeModal={ this.hideCreateProjectDialog }
              userRoles={ userRoles }
              onProjectUpdate={ (updatedProject, dirty=true) => {
                this.setState({
                  isProjectDirty: dirty
                })
              }
              }
            />
          }
          { errorCreatingProject && <CoderBot code={ 500 } message="Unable to create project" />}
        </Modal>
        <div className="primary-toolbar">
          { logo }
          {
            !!isLoggedIn &&
            <div className="search-widget">
              <SearchBar
                hideSuggestionsWhenEmpty
                showPopularSearchHeader={ false }
                searchTermKey="keyword"
                onTermChange={ this.handleTermChange }
                onSearch={ this.handleSearch }
                onClearSearch={ this.handleSearch }
              />
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
          {
            !!isLoggedIn &&
            <div>
              <a onClick={ this.showCreateProjectDialog } href="javascript:" className="tc-btn tc-btn-sm tc-btn-primary">+ New Project</a>
            </div>
          }
          { userMenu }
          </div>
        </div>
        <div className="secondary-toolbar">
        { isFilterVisible &&
          <Filters
            handleMyProjectsFilter={ this.handleMyProjectsFilter }
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
  criteria              : PropTypes.object.isRequired
}

ProjectsToolBar.defaultProps = {
}

// export default ProjectsToolBar

const mapStateToProps = ({ projectSearchSuggestions, searchTerm, projectSearch, projectState, loadUser }) => {
  let isPowerUser = false
  const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR]
  if (loadUser.user) {
    isPowerUser = loadUser.user.roles.some((role) => roles.indexOf(role) !== -1)
  }
  return {
    projects               : projectSearchSuggestions.projects,
    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag,
    creatingProject        : projectState.processing,
    projectCreationError   : projectState.error,
    project                : projectState.project,
    criteria               : projectSearch.criteria,
    userRoles              : _.get(loadUser, 'user.roles', []),
    user                   : loadUser.user,
    isPowerUser
  }
}

const actionsToBind = { projectSuggestions, loadProjects, createProjectAction }

export default connect(mapStateToProps, actionsToBind)(ProjectsToolBar)