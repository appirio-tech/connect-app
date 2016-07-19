require('./ProjectsToolBar.scss')

import React, {PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { SearchBar, QuickLinks, UserDropdown,
        ConnectLogo, TopcoderMobileLogo, HamburgerIcon,
        Dropdown
      } from 'appirio-tech-react-components'
import { projectSuggestions } from '../../actions/loadProjects'
import { loadProject } from '../../actions/loadProject'
import { StickyContainer, Sticky } from 'react-sticky'

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
    this.setState({ callback : callback, reqNo: reqNo })
  }

  handleSearch(searchTerm) {
    this.props.onSearch.apply(this, [searchTerm])
  }

  componentDidUpdate(nextProps) {
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
    const {domain} = this.props
    return (
      <Sticky stickyClassName="StickyProjectsToolBar">
        <div className="ProjectsToolBar flex middle space-between">
          <div className="heading">All Projects</div>
          <SearchBar recentTerms={ this.state.recentTerms } onTermChange={ this.handleTermChange } onSearch={ this.handleSearch } />
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

