import React, { Component } from 'react'
import { connect } from 'react-redux'
import { branch, renderComponent, compose, withProps } from 'recompose'
import { withRouter } from 'react-router-dom'
import Walkthrough from '../Walkthrough/Walkthrough'
import CoderBot from '../../../../components/CoderBot/CoderBot'
import ProjectListNavHeader from './ProjectListNavHeader'
import ProjectsGridView from './ProjectsGridView'
import ProjectsCardView from './ProjectsCardView'
import MediaQuery from 'react-responsive'
import { loadProjects, setInfiniteAutoload, setProjectsListView } from '../../../actions/loadProjects'
import { sortProjects } from '../../../actions/sortProjects'
import _ from 'lodash'
import querystring from 'query-string'
import { updateProject } from '../../../actions/project'
import { ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT, ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN, PROJECT_STATUS, PROJECT_STATUS_CANCELLED, PROJECT_STATUS_ACTIVE,
  PROJECT_LIST_DEFAULT_CRITERIA, PROJECTS_LIST_VIEW, PROJECTS_LIST_PER_PAGE } from '../../../../config/constants'

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const EnhancedGrid  = errorHandler(ProjectsGridView)
const EnhancedCards = errorHandler(ProjectsCardView)

class Projects extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.sortHandler = this.sortHandler.bind(this)
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.applyFilters = this.applyFilters.bind(this)
    this.applySearchFilter = this.applySearchFilter.bind(this)
    this.changeView = this.changeView.bind(this)
    this.init = this.init.bind(this)
    this.removeScrollPosition = this.removeScrollPosition.bind(this)
  }

  componentWillUnmount(){
    window.removeEventListener('beforeunload', this.removeScrollPosition)

    // save scroll position
    const scrollingElement = document.scrollingElement || document.documentElement
    window.sessionStorage.setItem('projectsPageScrollTop', scrollingElement.scrollTop)
  }

  componentWillReceiveProps(nextProps) {
    const prevQueryParams = _.get(this.props, 'location.search', null)
    const queryParams = _.get(nextProps, 'location.search', null)
    const { refresh } = nextProps
    if (!_.isEqual(prevQueryParams, queryParams) || refresh) {
      this.init(nextProps)
    }
  }
  onChangeStatus(projectId, status, reason) {
    const { updateProject } = this.props
    const delta = {status}
    const pId = projectId || this.props.project.id
    if (reason && status === PROJECT_STATUS_CANCELLED) {
      delta.cancelReason = reason
    }
    updateProject(pId, delta, true)
  }

  componentWillMount() {
    this.init(this.props)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.removeScrollPosition)

    // restore scroll position
    window.scrollTo(0, parseInt(window.sessionStorage.getItem('projectsPageScrollTop'), 10))
  }

  init(props) {
    document.title = 'Projects - Topcoder'
    // this.searchTermFromQuery = this.props.location.query.q || ''
    const {criteria, loadProjects, location, projects, refresh} = props
    // check for criteria specified in URL.
    const queryParams = querystring.parse(location.search)
    this.setState({status : null})
    if (!_.isEmpty(queryParams)) {
      const initialCriteria = {}
      initialCriteria.sort = (queryParams.sort) ? queryParams.sort : 'updatedAt desc'
      if (queryParams.keyword) initialCriteria.keyword = decodeURIComponent(queryParams.keyword)
      if (queryParams.status) {
        initialCriteria.status = queryParams.status
        this.setState({status : queryParams.status})
      }
      if (queryParams.type) initialCriteria.type = queryParams.type
      if (queryParams.memberOnly) initialCriteria.memberOnly = queryParams.memberOnly
      if (queryParams.view) this.setState({selectedView : queryParams.view})
      // load projects only if projects were loaded for different criteria
      // or there no loaded projects yet
      if (!_.isEqual(criteria, initialCriteria) || projects.length === 0 || refresh) {
        loadProjects(initialCriteria)
      }
    } else {
      // perform initial load only if there are not projects already loaded or only one projects
      // otherwise we will get projects duplicated in store
      if (projects.length <= 1 || refresh) {
        // for powerful user filter by 'active' status by default
        // we cannot put it to PROJECT_LIST_DEFAULT_CRITERIA because
        // it would apply for both powerful and regular users
        if (props.isPowerUser && !criteria.status) {
          criteria.status = PROJECT_STATUS_ACTIVE
        }
        this.routeWithParams(criteria)
      }
    }
  }

  removeScrollPosition() {
    // remove scroll position from local storage
    window.sessionStorage.removeItem('projectsPageScrollTop')
  }

  onPageChange(pageNum) {
    this.props.loadProjects(this.props.criteria, pageNum)
  }

  sortHandler(fieldName) {
    const hasMore = this.props.pageNum * PROJECTS_LIST_PER_PAGE < this.props.totalCount
    if (hasMore)
    {
      const criteria = _.assign({}, this.props.criteria, {
        sort: fieldName
      })
      this.routeWithParams(criteria)
    }
    else
    {
      this.props.sortProjects(fieldName)
    }
  }

  applyFilters(filter) {
    const criteria = _.assign({}, this.props.criteria, filter)
    this.routeWithParams(criteria)
  }

  applySearchFilter(filter) {
    const criteria = _.assign({}, this.props.criteria, filter)
    if (criteria && criteria.keyword) {
      // force sort criteria to updatedAt desc
      criteria.sort = 'updatedAt desc'
    }
    this.routeWithParams(criteria)
  }

  changeView(view) {
    this.setState({selectedView : view})
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

  render() {
    const { isPowerUser, isLoading, totalCount, criteria, currentUser, projectsListView, setProjectsListView, setInfiniteAutoload, loadProjects, history } = this.props
    // show walk through if user is customer and no projects were returned
    // for default filters
    const showWalkThrough = !isLoading && totalCount === 0 &&
      _.isEqual(criteria, PROJECT_LIST_DEFAULT_CRITERIA) &&
      !isPowerUser
    const getStatusCriteriaText = (criteria) => {
      return (_.find(PROJECT_STATUS, { value: criteria.status }) || { name: ''}).name
    }
    const gridView = (
      <EnhancedGrid {...this.props}
        onPageChange={this.onPageChange}
        sortHandler={this.sortHandler}
        applyFilters={this.applySearchFilter}
        onChangeStatus={this.onChangeStatus}
        projectsStatus={getStatusCriteriaText(criteria)}
      />
    )
    const cardView = (
      <EnhancedCards
        {...this.props }
        // onPageChange={this.onPageChange}
        // sortHandler={this.sortHandler}
        onPageChange={this.onPageChange}
        onChangeStatus={this.onChangeStatus}
        projectsStatus={getStatusCriteriaText(criteria)}
      />
    )
    let projectsView
    const chosenView = projectsListView
    const currentStatus = this.state.status || null
    if (isPowerUser) {
      if (chosenView === PROJECTS_LIST_VIEW.GRID) {
        projectsView = gridView
      } else if (chosenView === PROJECTS_LIST_VIEW.CARD) {
        projectsView = cardView
      }
    } else {
      projectsView = cardView
    }
    return (
      <div>
        <section className="">
          <div className="container">
            {(isPowerUser && !showWalkThrough) &&
              <ProjectListNavHeader applyFilters={this.applyFilters} selectedView={chosenView} changeView={setProjectsListView} currentStatus={currentStatus} criteria={criteria} setInfiniteAutoload={setInfiniteAutoload} loadProjects={loadProjects} history={history}/>}
            { showWalkThrough  ?
              (
                <Walkthrough currentUser={currentUser} />
              ) : (
                <MediaQuery minWidth={768}>
                  {(matches) => {
                    if (matches) {
                      return projectsView
                    } else {
                      return cardView
                    }
                  }}
                </MediaQuery>
              )
            }
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = ({ projectSearch, members, loadUser, projectState }) => {
  let isPowerUser = false
  const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  if (loadUser.user) {
    isPowerUser = loadUser.user.roles.some((role) => roles.indexOf(role) !== -1)
  }
  if (projectState.project && projectState.project.id && projectSearch.projects) {
    const index = _.findIndex(projectSearch.projects, {id: projectState.project.id})
    projectSearch.projects.splice(index, 1, projectState.project)
  }
  return {
    currentUser : {
      userId: loadUser.user.profile.userId,
      firstName: loadUser.user.profile.firstName,
      lastName: loadUser.user.profile.lastName,
      roles: loadUser.user.roles
    },
    isLoading   : projectSearch.isLoading,
    error       : projectSearch.error,
    projects    : projectSearch.projects,
    members     : members.members,
    totalCount  : projectSearch.totalCount,
    pageNum     : projectSearch.pageNum,
    criteria    : projectSearch.criteria,
    infiniteAutoload: projectSearch.infiniteAutoload,
    projectsListView: projectSearch.projectsListView,
    isPowerUser,
    gridView    : isPowerUser,
    refresh     : projectSearch.refresh
  }
}

const actionsToBind = { loadProjects, setInfiniteAutoload, updateProject, setProjectsListView, sortProjects }

export default withRouter(connect(mapStateToProps, actionsToBind)(Projects))
