import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProjectsView from './ProjectsView'
import { loadProjects } from '../../actions/loadProjects'
import { loadProject } from '../../actions/loadProject'
import { isEndOfScreen } from '../../../../helpers'

class Projects extends Component {
  constructor(props) {
    super(props)

    this.handleScroll = this.handleScroll.bind(this)
  }

  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll)

    this.searchTermFromQuery = this.props.location.query.q || ''
    console.log('loading projects..')
    this.props.loadProjects(this.searchTermFromQuery)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    const { moreMatchesAvailable, projects, loadingMore, pageLoaded } = this.props

    if (pageLoaded && !loadingMore && moreMatchesAvailable && projects.length > 10) {
      isEndOfScreen(this.props.loadProjects, this.searchTermFromQuery)
    }
  }

  render() {
    return React.createElement(ProjectsView, this.props)
  }
}

const mapStateToProps = ({ projectSearch, searchTerm }) => {
  return {
    pageLoaded             : projectSearch.pageLoaded,
    loadingMore            : projectSearch.loadingMore,
    error                  : projectSearch.error,

    projects               : projectSearch.projects,
    moreMatchesAvailable   : projectSearch.moreMatchesAvailable,
    totalCount             : projectSearch.totalCount,

    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag
  }
}

const actionsToBind = { loadProjects, loadProject }

export default connect(mapStateToProps, actionsToBind)(Projects)
