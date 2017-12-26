
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { loadProjectDashboard } from '../actions/projectDashboard'
import {
  LOAD_PROJECT_FAILURE, PROJECT_ROLE_CUSTOMER, PROJECT_ROLE_OWNER,
  ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN
} from '../../config/constants'
import spinnerWhileLoading from '../../components/LoadingSpinner'
import CoderBot from '../../components/CoderBot/CoderBot'

const page404 = compose(
  withProps({code:404})
)
const showCoderBotIfError = (hasError) =>
  branch(
    hasError,
    renderComponent(page404(CoderBot)), // FIXME pass in props code=400
    t => t
  )
const errorHandler = showCoderBotIfError(props => props.error && props.error.type === LOAD_PROJECT_FAILURE)

// This handles showing a spinner while the state is being loaded async
const spinner = spinnerWhileLoading(props => !props.isLoading)
const ProjectDetailView = (props) => {
  const children = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      project: props.project,
      currentMemberRole: props.currentMemberRole,
      isSuperUser: props.isSuperUser
    })
  })
  return <div>{children}</div>
}
const EnhancedProjectDetailView = spinner(errorHandler(ProjectDetailView))

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const projectId = this.props.match.params.projectId
    this.props.loadProjectDashboard(projectId)
  }

  componentWillReceiveProps({isProcessing, isLoading, error, project, match}) {
    // handle just deleted projects
    if (! (error || isLoading || isProcessing) && _.isEmpty(project))
      this.props.history.push('/projects/')
    if (project && project.name) {
      document.title = `${project.name} - Topcoder`
    }

    // load project if URL changed
    if (this.props.match.params.projectId !== match.params.projectId) {
      this.props.loadProjectDashboard(match.params.projectId)
    }
  }

  getProjectRoleForCurrentUser({currentUserId, project}) {
    let role = null
    if (project) {
      const member = _.find(project.members, m => m.userId === currentUserId)
      if (member) {
        role = member.role
        if (role === PROJECT_ROLE_CUSTOMER && member.isPrimary)
          role = PROJECT_ROLE_OWNER
      }
    }
    return role
  }

  render() {
    const currentMemberRole = this.getProjectRoleForCurrentUser(this.props)
    const powerRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
    const isSuperUser = this.props.currentUserRoles.some((role) => powerRoles.indexOf(role) !== -1)
    return (
      <EnhancedProjectDetailView
        {...this.props}
        currentMemberRole={currentMemberRole}
        isSuperUser={isSuperUser}
      />
    )
  }
}

const mapStateToProps = ({projectState, projectDashboard, loadUser}) => {
  return {
    currentUserId: parseInt(loadUser.user.id),
    isLoading: projectDashboard.isLoading,
    isProcessing: projectState.processing,
    error: projectState.error,
    project: projectState.project,
    currentUserRoles: loadUser.user.roles
  }
}

const mapDispatchToProps = { loadProjectDashboard }

ProjectDetail.propTypes = {
  project: PropTypes.object,
  currentUserId: PropTypes.number.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]).isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectDetail))
