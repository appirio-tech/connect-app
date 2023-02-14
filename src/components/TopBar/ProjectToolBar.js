require('./ProjectToolBar.scss')

import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { getNewProjectLink } from '../../helpers/projectHelper'
import NewProjectNavLink from './NewProjectNavLink'
import MobileMenu from '../MobileMenu/MobileMenu'
import MobileMenuToggle from '../MobileMenu/MobileMenuToggle'


import './ProjectToolBar.scss'

function isEllipsisActive(el) {
  return (el.offsetWidth < el.scrollWidth)
}


class ProjectToolBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isTooltipVisible: false,
      isMobileMenuOpen: false
    }
    this.onNameEnter = this.onNameEnter.bind(this)
    this.onNameLeave = this.onNameLeave.bind(this)
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)
  }

  onNameEnter() {
    const el = ReactDOM.findDOMNode(this.refs.name)
    if (isEllipsisActive(el)) {
      this.setState({ isTooltipVisible: true })
    }
  }

  onNameLeave() {
    this.setState({ isTooltipVisible: false })
  }

  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen })
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.isProjectLoading
  }

  render() {
    const { project, user, mobileMenu, orgConfig } = this.props
    const { isTooltipVisible, isMobileMenuOpen } = this.state

    return (
      <div className="ProjectToolBar">
        <div className="tool-bar">
          <div className="bar-column" />
          {project && project.name && <div className="bar-column project-name">
            <span ref="name" onMouseEnter={this.onNameEnter} onMouseLeave={this.onNameLeave}>{_.unescape(project.name)}</span>
            {isTooltipVisible && <div className="breadcrumb-tooltip">{_.unescape(project.name)}</div>}
          </div>}
          {project && project.name && <div className="bar-column project-name mobile"><span>{_.unescape(project.name)}</span></div>}
          <div className="bar-column">
            <NewProjectNavLink compact link={getNewProjectLink(orgConfig)} />
            <MobileMenuToggle onToggle={this.toggleMobileMenu}/>
          </div>
        </div>
        {isMobileMenuOpen && <MobileMenu user={user} onClose={this.toggleMobileMenu} menu={mobileMenu} />}
      </div>
    )
  }
}

ProjectToolBar.propTypes = {
  isProjectLoading: PT.bool,
  project: PT.object,
  /**
   * Function which render the logo section in the top bar
   */
  renderLogoSection: PT.func.isRequired
}

const mapStateToProps = ({ projectState, loadUser }) => {
  return {
    isProjectLoading: projectState.isLoading,
    project: projectState.project,
    userRoles: _.get(loadUser, 'user.roles', []),
    user: loadUser.user,
    orgConfig: loadUser.orgConfig
  }
}

const actionsToBind = {}

// export default ProjectToolBar
export default connect(mapStateToProps, actionsToBind)(withRouter(ProjectToolBar))
