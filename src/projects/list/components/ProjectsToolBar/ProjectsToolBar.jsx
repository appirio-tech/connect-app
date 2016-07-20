require('./ProjectsToolBar.scss')

import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { SearchBar, Dropdown } from 'appirio-tech-react-components'
import { projectSuggestions } from '../../actions/loadProjects'
import { loadProject } from '../../actions/loadProject'
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
    this.state = { recentTerms: [] }
  }

  handleTermChange(oldTerm, searchTerm, reqNo, callback) {
    this.props.projectSuggestions(searchTerm)
    this.setState({ callback, reqNo })
  }

  handleSearch(searchTerm) {
    this.props.onSearch.apply(this, [searchTerm])
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

  render() {
    // const {domain} = this.props
    return (
      <Sticky stickyClassName="StickyProjectsToolBar">
        <div className="ProjectsToolBar flex middle space-between">
          <div className="heading">All Projects</div>
          <SearchBar recentTerms={ this.state.recentTerms } onTermChange={ this.handleTermChange } onSearch={ this.handleSearch } />
          <div className="projectTypes">
            <Dropdown theme="default">
              <a className="dropdown-menu-header">All Types</a>
              <ul className="dropdown-menu-list">
                {
                  projectTypes.map((pt, i) => {
                    return <li key={i}><a href="javascript:;">{pt.value}</a></li>
                  })
                }
              </ul>
            </Dropdown>
          </div>
          <div className="projectStatuses">
            <Dropdown theme="default">
              <a className="dropdown-menu-header">All Status</a>
              <ul className="dropdown-menu-list">
                {
                  projectStatuses.map((pt, i) => {
                    return <li key={i}><a href="javascript:;">{pt.value}</a></li>
                  })
                }
              </ul>
            </Dropdown>
          </div>
          <div className="actions">
            <Link className="new-project-action tc-btn tc-btn-primary tc-btn-sm" to="projects/create" >+ New Project</Link>
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

const actionsToBind = { projectSuggestions, loadProject }

export default connect(mapStateToProps, actionsToBind)(ProjectsToolBar)

