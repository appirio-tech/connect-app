require('./ProjectToolBar.scss')

import _ from 'lodash'
import React, {PropTypes} from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdownContainer'
import {
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_ADMINISTRATOR
} from '../../config/constants'

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
    const {logo, userMenu, project } = this.props
    const {isTooltipVisible} = this.state

    return (
      <div className="ProjectToolBar">
        <div className="tool-bar">
          <div className="bar-column">
            {logo}
            {project && <div className="breadcrumb">
              <NavLink to="/projects">Projects /&nbsp;</NavLink>
              <span ref="name" onMouseEnter={this.onNameEnter} onMouseLeave={this.onNameLeave}>{project.name}</span>
            </div>}
            {isTooltipVisible && <div className="breadcrumb-tooltip">{project.name}</div>}
          </div>
          <div className="bar-column">
            {project && <nav className="nav">
              <ul>
                <li><NavLink to={`/projects/${project.id}`} exact activeClassName="active"><i className="icon-dashboard"/>Dashboard</NavLink></li>
                <li><NavLink to={`/projects/${project.id}/specification`} activeClassName="active"><i className="icon-specification"/>Specification</NavLink></li>
                {/*
                  TODO: Enable again when challenges link is needed.
                  isPowerUser && <li><NavLink to={`/projects/${project.id}/challenges`} activeClassName="active"><i className="icon-challenges"/>Challenges</Link></li>
                */}
                {/*
                  * TODO: Completely remome the discussions list item once there isn't
                  * any active project that uses discussions.
                  */}
                {
                  (project.details && !project.details.hideDiscussions) &&
                  <li><NavLink to={`/projects/${project.id}/discussions`} activeClassName="active"><i className="icon-messages"/>Discussions</NavLink></li>
                }
              </ul>
            </nav>}
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
  isPowerUser: PropTypes.bool
}

const mapStateToProps = ({ projectState, loadUser }) => {
  let isPowerUser = false
  const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR]
  if (loadUser.user) {
    isPowerUser = loadUser.user.roles.some((role) => roles.indexOf(role) !== -1)
  }
  return {
    project                : projectState.project,
    userRoles              : _.get(loadUser, 'user.roles', []),
    user                   : loadUser.user,
    isPowerUser
  }
}

const actionsToBind = {  }

// export default ProjectToolBar
export default connect(mapStateToProps, actionsToBind)(ProjectToolBar)
