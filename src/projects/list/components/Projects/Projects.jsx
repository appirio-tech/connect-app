import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ProjectsView from './ProjectsView'
import { loadProjects } from '../../../actions/loadProjects'
import _ from 'lodash'

class Projects extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.sortHandler = this.sortHandler.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.applyFilters = this.applyFilters.bind(this)
  }

  componentWillMount() {
    // this.searchTermFromQuery = this.props.location.query.q || ''
    const {criteria, loadProjects} = this.props
    let pageNum = this.props.pageNum
    // check for criteria specified in URL.
    const queryParams = _.get(this.props, 'location.query', null)
    if (!_.isEmpty(queryParams)) {
      if (queryParams.sort) criteria.sort = queryParams.sort
      if (queryParams.name) criteria.name = decodeURIComponent(queryParams.name)
      if (queryParams.status) criteria.status = queryParams.status
      if (queryParams.type) criteria.type = queryParams.type
      if (queryParams.memberOnly) criteria.memberOnly = queryParams.memberOnly
      if (queryParams.page) pageNum = parseInt(queryParams.page)
      loadProjects(criteria, pageNum)
    } else {
      this.routeWithParams(criteria, pageNum)
    }
  }

  onPageChange(pageNum) {
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
    return (
      <div>
        <ProjectsView {...this.props}
          onPageChange={this.onPageChange}
          sortHandler={this.sortHandler}
          applyFilters={this.applyFilters}
          onNewProjectIntent={ this.showCreateProjectDialog }
        />
      </div>
    )
  }
}

const mapStateToProps = ({ projectSearch, members, loadUser }) => {
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
    criteria    : projectSearch.criteria
  }
}

const actionsToBind = { loadProjects }

export default withRouter(connect(mapStateToProps, actionsToBind)(Projects))
