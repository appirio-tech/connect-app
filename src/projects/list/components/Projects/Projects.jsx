import React, { Component } from 'react'
import { connect } from 'react-redux'
import { branch, renderComponent } from 'recompose'
import { withRouter } from 'react-router-dom'
import Walkthrough from '../Walkthrough/Walkthrough'
import CoderBot from '../../../../components/CoderBot/CoderBot'
import ProjectsGridView from './ProjectsGridView'
import ProjectsCardView from './ProjectsCardView'
import { loadProjects, setInfiniteAutoload } from '../../../actions/loadProjects'
import _ from 'lodash'
import querystring from 'query-string'
import { ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT, ROLE_ADMINISTRATOR } from '../../../../config/constants'

/*
  Definiing default project criteria. This is used to later to determine if
  walkthrough component should be rendered instead of no results
 */
const defaultCriteria = {sort: 'updatedAt desc'}


const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, t => t, renderComponent(<CoderBot code={500} />))
const errorHandler = showErrorMessageIfError(props => !props.error)
const EnhancedGrid  = errorHandler(ProjectsGridView)
const EnhancedCards = errorHandler(ProjectsCardView)

class Projects extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.sortHandler = this.sortHandler.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.applyFilters = this.applyFilters.bind(this)
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
    const prevQueryParams = _.get(this.props, 'location.query', null)
    const queryParams = _.get(nextProps, 'location.query', null)
    if (!_.isEqual(prevQueryParams, queryParams)) {
      this.init(nextProps)
    }
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
    if (!_.isEmpty(queryParams)) {
      const initialCriteria = {}
      if (queryParams.sort) initialCriteria.sort = queryParams.sort
      if (queryParams.keyword) initialCriteria.keyword = decodeURIComponent(queryParams.keyword)
      if (queryParams.status) initialCriteria.status = queryParams.status
      if (queryParams.type) initialCriteria.type = queryParams.type
      if (queryParams.memberOnly) initialCriteria.memberOnly = queryParams.memberOnly
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
    const projectsView = isPowerUser
      ? (
        <EnhancedGrid
          {...this.props}
          onPageChange={this.onPageChange}
          sortHandler={this.sortHandler}
          applyFilters={this.applyFilters}
          projectsStatus={criteria.status || ''}
        />
      )
      : (
        <EnhancedCards
          {...this.props }
          // onPageChange={this.onPageChange}
          // sortHandler={this.sortHandler}
          applyFilters={this.applyFilters}
          onPageChange={this.onPageChange}
          projectsStatus={criteria.status || ''}
        />
      )
    return (
      <div>
        <section className="">
          <div className="container">
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

const actionsToBind = { loadProjects, setInfiniteAutoload }

export default withRouter(connect(mapStateToProps, actionsToBind)(Projects))
