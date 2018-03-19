require('./ProjectToolBar.scss')

import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdownContainer'
import NewProjectNavLink from './NewProjectNavLink'
import Dashboard from '../../assets/icons/icon-dashboard.svg'
import DashboardActive from '../../assets/icons/icon-dashboard-active.svg'
import Specification from '../../assets/icons/icon-ruler-pencil.svg'
import SpecificationActive from '../../assets/icons/icon-ruler-pencil-active.svg'
import Chat from '../../assets/icons/icon-chat.svg'
import ChatActive from '../../assets/icons/icon-chat-active.svg'
import TailLeft from '../../assets/icons/arrows-16px-1_tail-left.svg'
import { Link } from 'react-router-dom'

function isEllipsisActive(el) {
  return (el.offsetWidth < el.scrollWidth)
}


class ProjectToolBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isTooltipVisible: false,
      dashboardIcon: '',
      specificationIcon: '',
      activePage: 'dashboard',
      activeDashboard: 'not-active',
      activeSpecification: 'not-active',
      activeMessages: 'not-active'
    }
    this.onNameEnter = this.onNameEnter.bind(this)
    this.onNameLeave = this.onNameLeave.bind(this)
  }

  setActivePage() {
    const path = this.props.location.pathname
    const activeDashboardPage = path.search('projects') > 0
    const activeSpecificationPage = path.search('specification') > 0
    const activeChatPage = path.search('discussions') > 0

    if (activeSpecificationPage) {
      this.state.activePage = 'specification'
      this.state.specificationIcon = <SpecificationActive className="icon-specification-active" />
      this.state.dashboardIcon = <Dashboard className="icon-dashboard" />
      this.state.messagesIcon = <Chat className="icon-chat-active" />
    } else
    if (activeDashboardPage) {
      this.state.activePage = 'dashboard'
      this.state.dashboardIcon = <DashboardActive className="icon-dashboard-active" />
      this.state.specificationIcon = <Specification className="icon-specification" />
      this.state.messagesIcon = <Chat className="icon-chat-active" />
    }
    else
    if (activeChatPage) {
      this.state.activePage = 'discussions'
      this.state.dashboardIcon = <DashboardActive className="icon-dashboard-active" />
      this.state.specificationIcon = <Specification className="icon-specification" />
      this.state.messagesIcon = <ChatActive className="icon-chat-active" />
    }
  }

  onDashboardEnter() {
    if (this.state.activePage === 'dashboard') { return }
    this.setState({
      activeDashboard: 'active'
    })
  }

  onDashboardLeave() {
    if (this.state.activePage === 'dashboard') { return }
    this.setState({
      activeDashboard: 'not-active'
    })
  }

  onSpecificationEnter() {
    if (this.state.activePage === 'specification') { return }
    this.setState({
      activeSpecification: 'active'
    })
  }

  onSpecificationLeave() {
    if (this.state.activePage === 'specification') { return }
    this.setState({
      activeSpecification: 'not-active'
    })
  }

  onMessagesEnter() {
    if (this.state.activePage === 'discussions') { return }
    this.setState({
      activeMessages: 'active'
    })
  }

  onMessagesLeave() {
    if (this.state.activePage === 'discussions') { return }
    this.setState({
      activeMessages: 'not-active'
    })
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

  componentWillMount() {
    this.props.history.listen(() => {
      this.setActivePage()
      this.state.activeSpecification = this.state.activePage === 'dashboard' ? 'not-active' : this.state.activeSpecification,
      this.state.activeDashboard = this.state.activePage === 'specification' ? 'not-active' : this.state.activeDashboard
    })
  }

  componentWillUpdate() {
    this.setActivePage()
  }

  render() {
    // TODO: removing isPowerUser until link challenges is needed once again.
    const { renderLogoSection, userMenu, project } = this.props
    const { isTooltipVisible } = this.state
    this.setActivePage()

    return (
      <div className="ProjectToolBar">
        <div className="tool-bar">
          <div className="bar-column">
            {renderLogoSection()}
            {project && <div className="breadcrumb">
              <NavLink to="/projects">
                <TailLeft className="icon-tail-left" />
                <span>View All Projects</span></NavLink>
            </div>}
          </div>
          {project && <div className="bar-column project-name">
            <span ref="name" onMouseEnter={this.onNameEnter} onMouseLeave={this.onNameLeave}>{project.name}</span>
            {isTooltipVisible && <div className="breadcrumb-tooltip">{project.name}</div>}
          </div>}
          <div className="bar-column">
            {project && <nav className={`nav ${(project.details && !project.details.hideDiscussions) ? 'long-menu' : ''}`}>
              <ul>
                <li id={this.state.activeDashboard} onMouseOver={ev => this.onDashboardEnter(ev)} onMouseLeave={ev => this.onDashboardLeave(ev)}><NavLink to={`/projects/${project.id}`} exact activeClassName="dashboard active">
                  {this.state.dashboardIcon}<span>Dashboard</span></NavLink>
                </li>
                <li id={this.state.activeSpecification} onMouseEnter={ev => this.onSpecificationEnter(ev)} onMouseLeave={ev => this.onSpecificationLeave(ev)}><NavLink to={`/projects/${project.id}/specification`} activeClassName="specification active">
                  {this.state.specificationIcon}<span>Specification</span></NavLink>
                </li>
                {/*
                  TODO: Enable again when challenges link is needed.
                  isPowerUser && <li><NavLink to={`/projects/${project.id}/challenges`} activeClassName="active">{this.state.challengesIcon}<span>Challenges</span></Link></li>
                */}
                {/*
                  * TODO: Completely remove the discussions list item once there isn't
                  * any active project that uses discussions.
                  */}
                {
                  (project.details && !project.details.hideDiscussions) &&
                  <li id={this.state.activeMessages} onMouseOver={ev => this.onMessagesEnter(ev)} onMouseLeave={ev => this.onMessagesLeave(ev)}><NavLink to={`/projects/${project.id}/discussions`} activeClassName="discussions active">
                    {this.state.messagesIcon}<span>Discussions</span></NavLink>
                  </li>
                }
              </ul>
            </nav>}
            <NewProjectNavLink compact returnUrl={window.location.href} />
            {userMenu}
            <NotificationsDropdown />
          </div>
        </div>
        {project && <div className="secondary-toolbar">
          <div className="secondary_toolbar_items">
            <h2>
              <Link to={'/projects/' + project.id} className="trigger go-home hidden" >Dashboard</Link>
            </h2>
            <h2>
              <Link to={'/projects/' + project.id + '/stages'} className="trigger go-home hidden" >Project Plan</Link>
            </h2>
          </div>
        </div>}
      </div>
    )
  }
}

ProjectToolBar.propTypes = {
  project: PT.object,
  isPowerUser: PT.bool,
  /**
   * Function which render the logo section in the top bar
   */
  renderLogoSection: PT.func.isRequired
}

const mapStateToProps = ({ projectState, loadUser }) => {
  return {
    project: projectState.project,
    userRoles: _.get(loadUser, 'user.roles', []),
    user: loadUser.user
  }
}

const actionsToBind = {}

// export default ProjectToolBar
export default connect(mapStateToProps, actionsToBind)(withRouter(ProjectToolBar))
