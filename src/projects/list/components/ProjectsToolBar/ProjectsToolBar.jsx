require('./ProjectsToolBar.scss')

import _ from 'lodash'
import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { SearchBar, Dropdown, DropdownItem, SwitchButton } from 'appirio-tech-react-components'
import { projectSuggestions } from '../../actions/loadProjects'
import { Sticky } from 'react-sticky'

const projectTypes = [
  { val : null, label: 'All Types'},
  { val : 'generic', label: 'Work Project'},
  { val : 'visual_design', label: 'Visual Design'},
  { val : 'visual_prototype', label: 'Visual Prototype'},
  { val : 'app_dev', label: 'App Development'}
]

const projectStatuses = [
  { val : null, label: 'All Statuses'},
  { val : 'draft', label: 'Draft'},
  { val : 'in_review', label: 'In Review'},
  { val : 'reviewed', label: 'Will Launch'},
  { val : 'active', label: 'Working'},
  { val : 'completed', label: 'Done'}
]

class ProjectsToolBar extends Component {

  constructor(props) {
    super(props)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleMyProjectsFilter = this.handleMyProjectsFilter.bind(this)
  }

  // componentDidUpdate() {
  //   if (this.state.callback) {
  //     if (!this.props.error) {
  //       this.state.callback.apply(null, [this.state.reqNo, this.props.projects])
  //     } else {
  //       this.state.callback.apply(null, [this.state.reqNo, [], this.props.error])
  //     }
  //     // TODO decide if need to reset the call back or not
  //     this.setState({ callback : null })
  //   }
  // }


  /*eslint-disable no-unused-vars */
  handleTermChange(oldTerm, searchTerm, reqNo, callback) {
    this.props.projectSuggestions(searchTerm)
    // this.setState({ callback, reqNo })
  }
  /*eslint-enable */

  handleSearch(name) {
    this.props.applyFilters({ name })
  }

  handleMyProjectsFilter(event) {
    this.props.applyFilters({memberOnly: event.target.checked})
  }

  render() {
    const { criteria, applyFilters } = this.props
    const type = _.find(projectTypes, t => t.val === (criteria.type || null))
    const status = _.find(projectStatuses, t => t.val === (criteria.status || null))

    const _types = _.map(projectTypes, p => {
      return { val: { type: p.val }, label: p.label }
    })
    const _statuses = _.map(projectStatuses, p => {
      return { val: { status: p.val }, label: p.label }
    })
    return (
      <Sticky stickyClassName="StickyProjectsToolBar">
        <div className="ProjectsToolBar flex middle space-between">
          <div className="heading">All Projects</div>
          <SearchBar recentTerms={ [] } onTermChange={ this.handleTermChange } onSearch={ this.handleSearch } onClearSearch={ this.handleSearch } />
          <div className="project-types">
            <Dropdown theme="default" noPointer>
              <a className="dropdown-menu-header">{ type.label || 'All Types' }</a>
              <ul className="dropdown-menu-list">
                {
                  _types.map((item, i) =>
                    <DropdownItem key={i} item={item} onItemClick={applyFilters}  />
                  )
                }
              </ul>
            </Dropdown>
          </div>
          <div className="project-statuses">
            <Dropdown theme="default" noPointer>
              <a className="dropdown-menu-header">{ status.label || 'All Status' }</a>
              <ul className="dropdown-menu-list">
                {
                  _statuses.map((item, i) =>
                    <DropdownItem key={i} item={item} onItemClick={applyFilters}  />
                  )
                }
              </ul>
            </Dropdown>
          </div>
          <div className="my-projects-only">
            <SwitchButton
              onChange={ this.handleMyProjectsFilter }
              label="My projects only"
              name="my-projects-only"
              checked={criteria.memberOnly}
            />
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
    projects               : projectSearchSuggestions.projects,
    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag
  }
}

const actionsToBind = { projectSuggestions }

export default connect(mapStateToProps, actionsToBind)(ProjectsToolBar)
