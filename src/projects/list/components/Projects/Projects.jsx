import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectsView from './ProjectsView'
import { loadProjects } from '../../actions/loadProjects'

class Projects extends Component {
  constructor(props) {
    super(props)

    // this.handleScroll = this.handleScroll.bind(this)
  }

  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll)

    this.searchTermFromQuery = this.props.location.query.q || ''
    this.props.loadProjects(this.searchTermFromQuery)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return <ProjectsView {...this.props} />
  }
}

const mapStateToProps = ({ projectSearch, searchTerm, members }) => {
  return {
    isLoading              : projectSearch.isLoading,
    error                  : projectSearch.error,

    projects               : projectSearch.projects,
    // moreMatchesAvailable   : projectSearch.moreMatchesAvailable,
    totalCount             : projectSearch.totalCount,
    members                : members.members,
    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag
  }
}

const actionsToBind = { loadProjects }

export default connect(mapStateToProps, actionsToBind)(Projects)
