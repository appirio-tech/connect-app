import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Modal from 'react-modal'
import { Icons } from 'appirio-tech-react-components'
import { projectSuggestions, loadProjects } from '../../projects/actions/loadProjects'
import TopBar from './TopBar'
import CreateView from '../../projects/create/components/CreateView'
import { TCEmitter } from '../../helpers'
import {
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_ADMINISTRATOR,
  EVENT_ROUTE_CHANGE,
  ACCOUNTS_APP_LOGIN_URL,
  ACCOUNTS_APP_REGISTER_URL
} from '../../config/constants'

class TopBarContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isFilterVisible: false,
      isCreatingProject : false
    }
    this.RouteChangeListener = null
    this.applyFilters = this.applyFilters.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.showCreateProjectDialog = this.showCreateProjectDialog.bind(this)
    this.hideCreateProjectDialog = this.hideCreateProjectDialog.bind(this)
  }

  componentWillMount() {
    this.setState({currentPath: window.location.pathname})
    this.RouteChangeListener = TCEmitter.addListener(EVENT_ROUTE_CHANGE, (path) => {
      this.setState({currentPath: path})
    })
  }

  componentDidUpdate() {
    const isProjectDetails = /projects\/\d+/.test(this.state.currentPath)
    const contentDiv = document.getElementById('wrapper-main')
    if (!isProjectDetails && this.state.isFilterVisible) {
      contentDiv.classList.add('with-filters')
    } else {
      contentDiv.classList.remove('with-filters')
    }
  }

  toggleFilter() {
    const {isFilterVisible} = this.state
    const contentDiv = document.getElementById('wrapper-main')
    this.setState({isFilterVisible: !isFilterVisible}, () => {
      if (this.state.isFilterVisible) {
        contentDiv.classList.add('with-filters')
      } else {
        contentDiv.classList.remove('with-filters')
      }
    })
  }

  componentWillUnmount() {
    this.RouteChangeListener && this.RouteChangeListener.remove()
  }

  showCreateProjectDialog() {
    this.setState({
      isCreatingProject : true
    })
  }

  hideCreateProjectDialog() {
    this.setState({
      isCreatingProject : false
    })
  }

  applyFilters(filter) {
    const criteria = _.assign({}, this.props.criteria, filter)
    if (criteria && criteria.name)
      criteria.name = encodeURIComponent(criteria.name)
    this.routeWithParams(criteria, 1)
  }

  routeWithParams(criteria, page) {
    // remove any null values
    criteria = _.pickBy(criteria, _.identity)
    this.context.router.push({
      pathname: '/projects/',
      query: _.assign({}, criteria, { page })
    })
    this.props.loadProjects(criteria, page)
  }

  render() {
    const {isCreatingProject, currentPath, isFilterVisible } = this.state
    const isProjectDetails = /projects\/\d+/.test(currentPath)
    const isHomePage = this.context.router.isActive('/', true)
    // NOTE: hardcoding to connectv2, once connect v1
    window.host
    const loginUrl = `${ACCOUNTS_APP_LOGIN_URL}?retUrl=${window.location.protocol}//${window.location.host}/`
    const registerUrl = !isHomePage ? ACCOUNTS_APP_REGISTER_URL : null
    return (
      <div>
        <Modal
          isOpen={ isCreatingProject }
          className="project-creation-dialog"
          overlayClassName="project-creation-dialog-overlay"
          onRequestClose={ this.hideCreateProjectDialog }
        >
          <CreateView closeModal={this.hideCreateProjectDialog} />
          <div onClick={ this.hideCreateProjectDialog } className="project-creation-dialog-close">
            <Icons.XMarkIcon />
          </div>
        </Modal>
        <TopBar
          {...this.props}
          isProjectDetails={isProjectDetails}
          applyFilters={this.applyFilters}
          onNewProjectIntent={ this.showCreateProjectDialog }
          loginUrl={loginUrl}
          registerUrl={registerUrl}
          isFilterVisible={ isFilterVisible }
          onToggleFilter={ this.toggleFilter }
        />
      </div>
    )
  }
}

TopBarContainer.contextTypes = {
  router: PropTypes.object.isRequired
}

const mapStateToProps = ({ projectSearchSuggestions, searchTerm, projectSearch, projectState, loadUser }) => {
  let isPowerUser = false
  const roles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR]
  if (loadUser.user) {
    isPowerUser = loadUser.user.roles.some((role) => roles.indexOf(role) !== -1)
  }
  return {
    projects               : projectSearchSuggestions.projects,
    previousSearchTerm     : searchTerm.previousSearchTerm,
    searchTermTag          : searchTerm.searchTermTag,
    project                : projectState.project,
    criteria               : projectSearch.criteria,
    isPowerUser
  }
}

const actionsToBind = { projectSuggestions, loadProjects }

export default connect(mapStateToProps, actionsToBind)(TopBarContainer)
