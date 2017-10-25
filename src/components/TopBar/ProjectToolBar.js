require('./ProjectToolBar.scss')

import _ from 'lodash'
import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import SVGIconImage from '../SVGIconImage'
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
    this.onTransition = this.onTransition.bind(this)
    this.onNameEnter = this.onNameEnter.bind(this)
    this.onNameLeave = this.onNameLeave.bind(this)
  }

  onTransition() {
    // active links in menu are not automatically updated when navigating between project pages
    this.forceUpdate()
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

  componentDidMount() {
    const {router} = this.context
    router.registerTransitionHook(this.onTransition)
  }

  componentWillUnmount() {
    const {router} = this.context
    router.unregisterTransitionHook(this.onTransition)

  }

  render() {
    // TODO: removing isPowerUser until link challenges is needed once again.
    const {logo, userMenu, project } = this.props
    const {router} = this.context
    const {isTooltipVisible} = this.state

    const getLinkProps = (to) => ({
      to,
      className: router.isActive(to, true) ? 'active': ''
    })

    return (
      <div className="ProjectToolBar">
        <div className="tool-bar">
          <div className="bar-column">
            {logo}
            {project && <div className="breadcrumb">
              <Link to="/projects"><SVGIconImage filePath="arrows-16px-1_tail-left" /> <span>View All Projects</span></Link>
            </div>}
          </div>
          {project && <div className="bar-column project-name">
            <span ref="name" onMouseEnter={this.onNameEnter} onMouseLeave={this.onNameLeave}>{project.name}</span>
            {isTooltipVisible && <div className="breadcrumb-tooltip">{project.name}</div>}
          </div>}
          <div className="bar-column">
            {project && <nav className="nav">
              <ul>
                <li><Link {...getLinkProps(`/projects/${project.id}`)}><i className="icon-dashboard"/>Dashboard</Link></li>
                <li><Link {...getLinkProps(`/projects/${project.id}/specification`)}><i className="icon-specification"/>Specification</Link></li>
                {/*
                  TODO: Enable again when challenges link is needed.
                  isPowerUser && <li><Link {...getLinkProps(`/projects/${project.id}/challenges`)}><i className="icon-challenges"/>Challenges</Link></li>
                */}
                {/*
                  * TODO: Completely remome the discussions list item once there isn't
                  * any active project that uses discussions.
                  */}
                {
                  (project.details && !project.details.hideDiscussions) &&
                  <li><Link {...getLinkProps(`/projects/${project.id}/discussions`)}><i className="icon-messages"/>Discussions</Link></li>
                }
              </ul>
            </nav>}
            { userMenu }
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

ProjectToolBar.contextTypes = {
  router: PropTypes.object.isRequired
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
