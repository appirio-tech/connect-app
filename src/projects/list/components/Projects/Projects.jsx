import React, { Component } from 'react'
import { connect } from 'react-redux'
import { branch, renderComponent, compose, withProps } from 'recompose'
import { withRouter } from 'react-router-dom'
import Walkthrough from '../Walkthrough/Walkthrough'
import CoderBot from '../../../../components/CoderBot/CoderBot'
import ProjectListNavHeader from './ProjectListNavHeader'
import ProjectsGridView from './ProjectsGridView'
import ProjectsCardView from './ProjectsCardView'
import { loadProjects, setInfiniteAutoload } from '../../../actions/loadProjects'
import _ from 'lodash'
import querystring from 'query-string'
import { updateProject } from '../../../actions/project'
import { ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT, ROLE_ADMINISTRATOR, PROJECT_STATUS, PROJECT_STATUS_CANCELLED } from '../../../../config/constants'

/*
  Definiing default project criteria. This is used to later to determine if
  walkthrough component should be rendered instead of no results
 */
const defaultCriteria = {sort: 'updatedAt desc'}

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
    if (!_.isEqual(prevQueryParams, queryParams)) {
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
    updateProject(pId, delta)
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
    const {criteria, loadProjects, location, projects} = props
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
      if (!_.isEqual(criteria, initialCriteria) || projects.length === 0) {
        loadProjects(initialCriteria)
      }
    } else {
      // perform initial load only if there are not projects already loaded
      // otherwise we will get projects duplicated in store
      if (projects.length === 0) {
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
    const criteria = _.assign({}, this.props.criteria, {
      sort: fieldName
    })
    this.routeWithParams(criteria)
  }

  applyFilters(filter) {
    const criteria = _.assign({}, this.props.criteria, filter)
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
    const { isPowerUser, isLoading, totalCount, criteria, currentUser } = this.props
    // show walk through if user is customer and no projects were returned
    // for default filters
    const showWalkThrough = !isLoading && totalCount === 0 &&
      _.isEqual(criteria, defaultCriteria) &&
      !isPowerUser
    const getStatusCriteriaText = (criteria) => {
      return (_.find(PROJECT_STATUS, { value: criteria.status }) || { name: ''}).name
    }
    const gridView = (
      <EnhancedGrid {...this.props}
        onPageChange={this.onPageChange}
        sortHandler={this.sortHandler}
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
        projectsStatus={getStatusCriteriaText(criteria)}
      />
    )
    let projectsView
    const chosenView = this.state.selectedView || 'grid'
    const currentStatus = this.state.status || null
    if (isPowerUser) {
      if (chosenView === 'grid') {
        projectsView = gridView
      } else if (chosenView === 'card') {
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
              <ProjectListNavHeader applyFilters={this.applyFilters} selectedView={chosenView} changeView={this.changeView} currentStatus={currentStatus}/>}
            { showWalkThrough  ? <Walkthrough currentUser={currentUser} /> : projectsView }
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = ({ projectSearch, members, loadUser }) => {
  let isPowerUser = false
  const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR]
  if (loadUser.user) {
    isPowerUser = loadUser.user.roles.some((role) => roles.indexOf(role) !== -1)
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
    isPowerUser,
    gridView    : isPowerUser
  }
}

const actionsToBind = { loadProjects, setInfiniteAutoload, updateProject }

export default withRouter(connect(mapStateToProps, actionsToBind)(Projects))
