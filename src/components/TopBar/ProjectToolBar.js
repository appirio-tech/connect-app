import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import ReactDOM from 'react-dom'
import Sticky from 'react-stickynode'


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
    //const {logo, avatar, project, isPowerUser} = this.props
    // TODO: removing isPowerUser until link challenges is needed once again.
    const {logo, avatar, project } = this.props
    const {router} = this.context
    const {isTooltipVisible} = this.state

    const getLinkProps = (to) => ({
      to,
      className: router.isActive(to, true) ? 'active': ''
    })

    return (
      <Sticky>
        <div className="tc-header tc-header__connect-project">
          <div className="top-bar">
            <div className="bar-column">
              {logo}
              {project && <div className="breadcrumb">
                <Link to="/projects">Projects /&nbsp;</Link>
                <span ref="name" onMouseEnter={this.onNameEnter} onMouseLeave={this.onNameLeave}>{project.name}</span>
              </div>}
              {isTooltipVisible && <div className="breadcrumb-tooltip">{project.name}</div>}
            </div>
            <div className="bar-column">
              {project && <nav className="nav">
                <ul>
                  <li><Link {...getLinkProps(`/projects/${project.id}`)}><i className="icon-dashboard"/>Dashboard</Link></li>
                  <li><Link {...getLinkProps(`/projects/${project.id}/specification`)}><i className="icon-specification"/>Specification</Link></li>
                  {/*
                    TODO: Enable again when challenges link is needed.
                    isPowerUser && <li><Link {...getLinkProps(`/projects/${project.id}/challenges`)}><i className="icon-challenges"/>Challenges</Link></li>
                  */}
                  <li><Link {...getLinkProps(`/projects/${project.id}/discussions`)}><i className="icon-messages"/>Discussions</Link></li>
                </ul>
              </nav>}
              {avatar}
            </div>
          </div>
        </div>
      </Sticky>
    )
  }
}

ProjectToolBar.propTypes = {
  logo: PropTypes.any.isRequired,
  avatar: PropTypes.any.isRequired,
  project: PropTypes.object,
  isPowerUser: PropTypes.bool
}

ProjectToolBar.contextTypes = {
  router: PropTypes.object.isRequired
}

export default ProjectToolBar
