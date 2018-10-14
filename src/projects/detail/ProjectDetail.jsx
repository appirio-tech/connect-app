
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { loadProjectDashboard } from '../actions/projectDashboard'
import { clearLoadedProject } from '../actions/project'
import {
  LOAD_PROJECT_FAILURE, PROJECT_ROLE_CUSTOMER, PROJECT_ROLE_OWNER,
  ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN, ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER
} from '../../config/constants'
import spinnerWhileLoading from '../../components/LoadingSpinner'
import CoderBot from '../../components/CoderBot/CoderBot'
import { getProjectProductTemplates, getProjectTemplateById } from '../../helpers/templates'

const page404 = compose(
  withProps({code:404})
)
const showCoderBotIfError = (hasError) => {

  let component = page404

  return branch(
    (props) => {
      if (props.error.code === 403 && props.error.msg.includes('Copilot')) {
        const messageGenerator = `${props.error.msg.replace('Copilot: ', '')}. If things don’t work or you’re sure it is Coder’s fault, send us a note at <a href="support@topcoder.com">support@topcoder.com</a> and we’ll fix it for you.`
        component = compose(
          withProps({code:403, message: messageGenerator})
        )
      }
      return hasError(props)
    },
    comp => renderComponent(component(CoderBot))(comp), // FIXME pass in props code=400
    t => t
  )
}
const errorHandler = showCoderBotIfError(props => props.error && props.error.type === LOAD_PROJECT_FAILURE)

// This handles showing a spinner while the state is being loaded async
const spinner = spinnerWhileLoading(props =>
  !props.isLoading && (
    // first check that there are no error, before checking project properties
    props.error && props.error.type === LOAD_PROJECT_FAILURE ||
    // old project or has projectTemplate loaded
    (props.project.version !== 'v3' || props.projectTemplate)
    // has product templates loaded
    && props.productTemplates.length > 0
  )
)
const ProjectDetailView = (props) => {
  let currentMemberRole = props.currentMemberRole
  if (!currentMemberRole && props.currentUserRoles && props.currentUserRoles.length > 0) {
    currentMemberRole = props.currentUserRoles[0]
  }
  const regex = /#(feed-([0-9]+)|comment-([0-9]+))/
  const match = props.location.hash.match(regex)
  const ids = match ? { feedId: match[2], commentId: match[3] } : {}
  const children = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      project: props.project,
      currentMemberRole: currentMemberRole || '',
      isSuperUser: props.isSuperUser,
      isManageUser: props.isManageUser,
      isCustomerUser: props.isCustomerUser,
      isProcessing: props.isProcessing,
      allProductTemplates: props.allProductTemplates,
      productsTimelines: props.productsTimelines,
      ...ids
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

  componentWillUnmount() {
    this.props.clearLoadedProject()
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
    const adminRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
    const isSuperUser = this.props.currentUserRoles.some((role) => adminRoles.indexOf(role) !== -1)
    const powerRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER]
    const isManageUser = this.props.currentUserRoles.some((role) => powerRoles.indexOf(role) !== -1)
    const isCustomerUser = !(isManageUser || isSuperUser)
    return (
      <EnhancedProjectDetailView
        {...this.props}
        currentMemberRole={currentMemberRole}
        isSuperUser={isSuperUser}
        isManageUser={isManageUser}
        isCustomerUser={isCustomerUser}
      />
    )
  }
}

const mapStateToProps = ({projectState, projectDashboard, loadUser, productsTimelines, templates}) => {
  const templateId = (projectState.project || {}).templateId
  const { projectTemplates, productTemplates } = templates

  return {
    currentUserId: parseInt(loadUser.user.id),
    isLoading: projectDashboard.isLoading,
    isProcessing: projectState.processing,
    error: projectState.error,
    project: projectState.project,
    projectTemplate: (templateId && projectTemplates) ? (
      getProjectTemplateById(projectTemplates, templateId)
    ) : null,
    productTemplates: (projectTemplates && productTemplates) ? (
      getProjectProductTemplates(
        productTemplates,
        projectTemplates,
        projectState.project
      )
    ) : [],
    productsTimelines,
    allProductTemplates: templates.productTemplates,
    currentUserRoles: loadUser.user.roles
  }
}

const mapDispatchToProps = { loadProjectDashboard, clearLoadedProject }

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
