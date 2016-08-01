require('./ProjectsToolBar.scss')

import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { SearchBar, Dropdown, SwitchButton } from 'appirio-tech-react-components'
import { projectSuggestions, loadProjects } from '../../actions/loadProjects'
import { Sticky } from 'react-sticky'

const projectTypes = [
  { key : 'dev', value: 'Development'},
  { key : 'design', value: 'Design'},
  { key : 'data', value: 'Data'},
  { key : 'dev-design', value: 'Design & Development'}
]

const projectStatuses = [
  { key : 'dev', value: 'Development'},
  { key : 'design', value: 'Design'},
  { key : 'data', value: 'Data'},
  { key : 'dev-design', value: 'Design & Development'}
]

// properties: domain

class ProjectsToolBar extends Component {

  constructor(props) {
    super(props)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleTypeFilter = this.handleTypeFilter.bind(this)
    this.handleStatusFilter = this.handleStatusFilter.bind(this)
    this.handleMyProjectsFilter = this.handleMyProjectsFilter.bind(this)
    this.state = { recentTerms: [], filter: { type: {}, status: {}} }
  }

  componentDidUpdate() {
    if (this.state.callback) {
      if (!this.props.error) {
        this.state.callback.apply(null, [this.state.reqNo, this.props.projects])
      } else {
        this.state.callback.apply(null, [this.state.reqNo, [], this.props.error])
      }
      // TODO decide if need to reset the call back or not
      this.setState({ callback : null })
    }
  }

  handleTermChange(oldTerm, searchTerm, reqNo, callback) {
    this.props.projectSuggestions(searchTerm)
    this.setState({ callback, reqNo })
  }

  handleSearch(searchTerm) {
    this.props.loadProjects.apply(this, [searchTerm])
  }

  handleTypeFilter(type) {
    console.log(type)
    const filter = this.state.filter
    filter.type = type
    this.setState({ filter })
  }

  handleStatusFilter(status) {
    console.log(status)
    const filter = this.state.filter
    filter.status = status
    this.setState({ filter })
  }

  handleMyProjectsFilter(event) {
    console.log(event.target.checked)
    this.setState({ filter :  { myProjects : event.target.checked } })
  }

  render() {
    const { filter } = this.state
    const { type, status } = filter
    return (
      <Sticky stickyClassName="StickyProjectsToolBar">
        <div className="ProjectsToolBar flex middle space-between">
          <div className="heading">All Projects</div>
          <SearchBar recentTerms={ this.state.recentTerms } onTermChange={ this.handleTermChange } onSearch={ this.handleSearch } />
          <div className="project-types">
            <Dropdown theme="default" noPointer>
              <a className="dropdown-menu-header">{ type.value || 'All Types' }</a>
              <ul className="dropdown-menu-list">
                {
                  projectTypes.map((pt, i) => {
                    return <li key={i} onClick={ function() { this.handleTypeFilter(pt) } }><a href="javascript:;">{pt.value}</a></li>
                  })
                }
              </ul>
            </Dropdown>
          </div>
          <div className="project-statuses">
            <Dropdown theme="default" noPointer>
              <a className="dropdown-menu-header">{ status.value || 'All Status' }</a>
              <ul className="dropdown-menu-list">
                {
                  projectStatuses.map((ps, i) => {
                    return <li key={i} onClick={ function() { this.handleStatusFilter(ps) } }><a href="javascript:;">{ps.value}</a></li>
                  })
                }
              </ul>
            </Dropdown>
          </div>
          <div className="my-projects-only">
            <SwitchButton onChange={ this.handleMyProjectsFilter } label="My projects only" name="my-projects-only" />
          </div>
          <div className="actions">
            <Link className="new-project-action" to="projects/create" >
              <button className="tc-btn tc-btn-primary tc-btn-sm">+ New Project</button>
            </Link>
          </div>
        </div>
      </Sticky>
    )
  }
}

const mapStateToProps = ({ projectSearchSuggestions, searchTerm }) => {
  return {
    pageLoaded             : projectSearchSuggestions.loaded,
    error                  : projectSearchSuggestions.error,

    projects               : projectSearchSuggestions.projects,
    moreMatchesAvailable   : projectSearchSuggestions.moreMatchesAvailable,
    totalCount             : projectSearchSuggestions.totalCount,

    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag
  }
}

const actionsToBind = { projectSuggestions, loadProjects }

export default connect(mapStateToProps, actionsToBind)(ProjectsToolBar)
