import React, { Component } from 'react'
import { connect } from 'react-redux'
import { branch, renderComponent, compose } from 'recompose'
import { withRouter } from 'react-router'
import Walkthrough from '../Walkthrough/Walkthrough'
import CoderBot from '../../../../components/CoderBot/CoderBot'
import ProjectsView from './ProjectsView'
import ProjectsCardView from './ProjectsCardView'
import { loadProjects } from '../../../actions/loadProjects'
import _ from 'lodash'
import { ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT, ROLE_ADMINISTRATOR } from '../../../../config/constants'

// This handles showing a spinner while the state is being loaded async
import spinnerWhileLoading from '../../../../components/LoadingSpinner'

/*
  Definiing default project criteria. This is used to later to determine if
  walkthrough component should be rendered instead of no results
 */
const defaultCriteria = {sort: 'createdAt desc'}


const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, t => t, renderComponent(<CoderBot code={500} />))
const errorHandler = showErrorMessageIfError(props => !props.error)
const spinner = spinnerWhileLoading(props => !props.isLoading)
const enhance = compose(errorHandler, spinner)
const EnhancedGrid  = enhance(ProjectsView)
const EnhancedCards = enhance(ProjectsCardView)

class Projects extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.sortHandler = this.sortHandler.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.applyFilters = this.applyFilters.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidUpdate() {
    window.scrollTo(0, parseInt(window.sessionStorage.getItem('projectsPageScrollTop')))
  }

  componentWillUnmount(){
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

  init(props) {
    document.title = 'Projects - Topcoder'
    // this.searchTermFromQuery = this.props.location.query.q || ''
    const {criteria, loadProjects} = props
    let pageNum = props.pageNum
    // check for criteria specified in URL.
    const queryParams = _.get(props, 'location.query', null)
    if (!_.isEmpty(queryParams)) {
      const initialCriteria = {}
      if (queryParams.sort) initialCriteria.sort = queryParams.sort
      if (queryParams.keyword) initialCriteria.keyword = decodeURIComponent(queryParams.keyword)
      if (queryParams.status) initialCriteria.status = queryParams.status
      if (queryParams.type) initialCriteria.type = queryParams.type
      if (queryParams.memberOnly) initialCriteria.memberOnly = queryParams.memberOnly
      if (queryParams.page) pageNum = parseInt(queryParams.page)
      loadProjects(initialCriteria, pageNum)
    } else {
      this.routeWithParams(criteria, pageNum)
    }
  }

  onPageChange(pageNum) {
    window.sessionStorage.removeItem('projectsPageScrollTop')
    this.routeWithParams(this.props.criteria, pageNum)
  }

  sortHandler(fieldName) {
    const criteria = _.assign({}, this.props.criteria, {
      sort: fieldName
    })
    this.routeWithParams(criteria, 1 /* reset pageNum */)
  }

  applyFilters(filter) {
    const criteria = _.assign({}, this.props.criteria, filter)
    this.routeWithParams(criteria, 1)
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

  render() {
    const { isPowerUser, isLoading, totalCount, criteria, currentUser } = this.props
    // show walk through if user is customer and no projects were returned
    // for default filters
    const showWalkThrough = !isLoading && totalCount === 0 &&
      _.isEqual(criteria, defaultCriteria) &&
      !isPowerUser
    const projectsView = isPowerUser
      ? (
        <EnhancedGrid {...this.props}
          onPageChange={this.onPageChange}
          sortHandler={this.sortHandler}
          applyFilters={this.applyFilters}
        />
      )
      : (
        <EnhancedCards
          {...this.props }
          // onPageChange={this.onPageChange}
          // sortHandler={this.sortHandler}
          applyFilters={this.applyFilters}
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
    isPowerUser
  }
}

const actionsToBind = { loadProjects }

export default withRouter(connect(mapStateToProps, actionsToBind)(Projects))
