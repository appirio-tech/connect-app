require('./ProjectToolBar.scss')

import _ from 'lodash'
import React, {PropTypes} from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdownContainer'
import SVGIconImage from '../SVGIconImage'
import NewProjectNavLink from './NewProjectNavLink'

function isEllipsisActive(el) {
  return (el.offsetWidth < el.scrollWidth)
}

class ProjectToolBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isTooltipVisible: false
    }
    this.onNameEnter = this.onNameEnter.bind(this)
    this.onNameLeave = this.onNameLeave.bind(this)
  }

  onNameEnter() {
    const el = ReactDOM.findDOMNode(this.refs.name)
    if (isEllipsisActive(el)) {
      this.setState({isTooltipVisible: true})
    }
  }

  onNameLeave() {
    this.setState({isTooltipVisible: false})
  }

  render() {
    // TODO: removing isPowerUser until link challenges is needed once again.
    const { renderLogoSection, userMenu, project } = this.props
    const {isTooltipVisible} = this.state

    return (
      <div className="ProjectToolBar">
        <div className="tool-bar">
          <div className="bar-column">
            { renderLogoSection() }
            {project && <div className="breadcrumb">
              <NavLink to="/projects"><SVGIconImage filePath="arrows-16px-1_tail-left" /> <span>View All Projects</span></NavLink>
            </div>}
          </div>
          {project && <div className="bar-column project-name">
            <span ref="name" onMouseEnter={this.onNameEnter} onMouseLeave={this.onNameLeave}>{project.name}</span>
            {isTooltipVisible && <div className="breadcrumb-tooltip">{project.name}</div>}
          </div>}
          <div className="bar-column">
            {project && <nav className={`nav ${(project.details && !project.details.hideDiscussions) ? 'long-menu' : ''}`}>
              <ul>
                <li><NavLink to={`/projects/${project.id}`} exact activeClassName="active"><i className="icon-dashboard"/>Dashboard</NavLink></li>
                <li><NavLink to={`/projects/${project.id}/specification`} activeClassName="active"><i className="icon-specification"/>Specification</NavLink></li>
                {/*
                  TODO: Enable again when challenges link is needed.
                  isPowerUser && <li><NavLink to={`/projects/${project.id}/challenges`} activeClassName="active"><i className="icon-challenges"/>Challenges</Link></li>
                */}
                {/*
                  * TODO: Completely remove the discussions list item once there isn't
                  * any active project that uses discussions.
                  */}
                {
                  (project.details && !project.details.hideDiscussions) &&
                  <li><NavLink to={`/projects/${project.id}/discussions`} activeClassName="active"><i className="icon-messages"/>Discussions</NavLink></li>
                }
              </ul>
            </nav>}
            <NewProjectNavLink compact returnUrl={window.location.href} />
            { userMenu }
            <NotificationsDropdown />
          </div>
        </div>
      </div>
    )
  }
}

ProjectToolBar.propTypes = {
  project: PropTypes.object,
  isPowerUser: PropTypes.bool,
  /**
   * Function which render the logo section in the top bar
   */
  renderLogoSection     : PropTypes.func.isRequired
}

const mapStateToProps = ({ projectState, loadUser }) => {
  return {
    project                : projectState.project,
    userRoles              : _.get(loadUser, 'user.roles', []),
    user                   : loadUser.user
  }
}

const actionsToBind = {  }

// export default ProjectToolBar
export default connect(mapStateToProps, actionsToBind)(ProjectToolBar)
