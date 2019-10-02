
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import qs from 'query-string'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { loadProjectDashboard } from '../actions/projectDashboard'
import { clearLoadedProject } from '../actions/project'
import { acceptOrRefuseInvite, acceptOrRefuseInviteFail } from '../actions/projectMember'
import { loadProjects } from '../actions/loadProjects'
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator'

import {
  LOAD_PROJECT_FAILURE, PROJECT_ROLE_CUSTOMER, PROJECT_ROLE_OWNER,
  ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN, ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER,
  PROJECT_MEMBER_INVITE_STATUS_ACCEPTED, PROJECT_MEMBER_INVITE_STATUS_REFUSED, ACCEPT_OR_REFUSE_INVITE_FAILURE
} from '../../config/constants'
import spinnerWhileLoading from '../../components/LoadingSpinner'
import CoderBot from '../../components/CoderBot/CoderBot'
import { getProjectProductTemplates, getProjectTemplateById } from '../../helpers/templates'
import Dialog from '../../components/TeamManagement/Dialog'
import { getProductEstimate } from '../../config/projectWizard'


const JOIN_INVITE_TITLE = 'You\'re invited to join this project'

const JOIN_INVITE_MESSAGE = `Once you join the team you will be able to see the project details,
  collaborate on project specification and monitor the progress of all deliverables`

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
      // server always returns 403 when page is not found or user doesn't have access,
      // so 403 errors we don't customize and show `page404` instead
      } else if (props.error && props.error.code && props.error.code !== 403) {
        component = compose(
          withProps({ code:props.error.code })
        )
      }
      return hasError(props)
    },
    comp => renderComponent(component(CoderBot))(comp), // FIXME pass in props code=400
    t => t
  )
}
const errorHandler = showCoderBotIfError(props => props.error && (props.error.type === LOAD_PROJECT_FAILURE || props.error.type === ACCEPT_OR_REFUSE_INVITE_FAILURE))

// This handles showing a spinner while the state is being loaded async
const spinner = spinnerWhileLoading(props =>
  !props.isLoading && (
    // first check that there are no error, before checking project properties
    props.error && props.error.type === LOAD_PROJECT_FAILURE || props.error.type === ACCEPT_OR_REFUSE_INVITE_FAILURE ||
    // old project or has projectTemplate loaded
    ((props.project && props.project.version !== 'v3') || props.projectTemplate)
    // has all product templates loaded (earlier it was checking project specific product templates only
    // which can be empty when we have empty project plan config for the template)
    && props.allProductTemplates.length > 0
  )
)
const ProjectDetailView = (props) => {
  let currentMemberRole = props.currentMemberRole
  if (!currentMemberRole && props.currentUserRoles && props.currentUserRoles.length > 0) {
    currentMemberRole = props.currentUserRoles[0]
  }

  const template = _.get(props.projectTemplate, 'scope', {})
  let estimationQuestion = null
  const { estimateBlocks } = getProductEstimate({scope: template}, props.project)

  if (estimateBlocks.length > 0){
    _.forEach(template.sections, (section) => {
      _.forEach(section.subSections, (subSection) => {
        if (subSection.type === 'questions') {
          _.forEach(subSection.questions, (question) => {
            if(question.type === 'estimation') {
              estimationQuestion = question
              estimationQuestion.title = 'Project Scope'
              return false
            }
          })
        }
      })
    })
  }

  const { component: Component } = props
  const componentProps = {
    project: props.project,
    projectNonDirty: props.projectNonDirty,
    currentMemberRole: currentMemberRole || '',
    isSuperUser: props.isSuperUser,
    isManageUser: props.isManageUser,
    isCustomerUser: props.isCustomerUser,
    isProcessing: props.isProcessing,
    allProductTemplates: props.allProductTemplates,
    productsTimelines: props.productsTimelines,
    match: props.match,
    history: props.history,
    location: props.location,
    estimationQuestion,
    projectTemplate: props.projectTemplate,
  }
  return <Component {...componentProps} />
}
const EnhancedProjectDetailView = spinner(errorHandler(ProjectDetailView))

class ProjectDetail extends Component {
  constructor(props) {
    super(props)

    this.onUserInviteAction = this.onUserInviteAction.bind(this)
    this.shouldForceCallAcceptRefuseRequest = this.shouldForceCallAcceptRefuseRequest.bind(this)
  }

  componentWillMount() {
    const projectId = this.props.match.params.projectId
    this.props.loadProjectDashboard(projectId)
  }

  componentWillUnmount() {
    this.props.clearLoadedProject()
  }

  componentWillReceiveProps(nextProps) {
    const {isProcessing, isLoading, error, project, match, showUserInvited} = nextProps
    // handle just deleted projects
    if (! (error || isLoading || isProcessing) && _.isEmpty(project))
      this.props.history.push('/projects/')
    if (project && project.name) {
      document.title = `${project.name} - Topcoder`
    }

    // if project version not v3 , URL /scope redirect to /specification
    if(project
      && project.version
      && project.version !== 'v3'
      && project.id === parseInt(match.params.projectId)
      &&  this.props.history.location.pathname.indexOf('/scope') !== -1 ){
      this.props.history.push(this.props.history.location.pathname.replace('/scope', '/specification'))
    }

    // load project if URL changed
    if (this.props.match.params.projectId !== match.params.projectId) {
      this.props.loadProjectDashboard(match.params.projectId)
    }

    const { previousShowUserInvited } = this.props
    if ((!error) && showUserInvited === true && !previousShowUserInvited && this.shouldForceCallAcceptRefuseRequest()) {
      const queryUrlParams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      this.onUserInviteAction(queryUrlParams.invitation === 'accept')
    }

    if (project && project.invites.length > 0 && this.shouldForceCallAcceptRefuseRequest()) {
      // remove invitation query param
      this.props.history.replace(`/projects/${this.props.match.params.projectId}`)
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

  onUserInviteAction(isJoining) {
    if (this.isCallingInviteAction) {
      return
    }
    const { acceptOrRefuseInvite, acceptOrRefuseInviteFail } = this.props
    this.isCallingInviteAction = true
    acceptOrRefuseInvite(this.props.match.params.projectId, {
      userId: this.props.currentUserId,
      email: this.props.currentUserEmail,
      status: isJoining ? PROJECT_MEMBER_INVITE_STATUS_ACCEPTED : PROJECT_MEMBER_INVITE_STATUS_REFUSED
    }).then(() => {
      this.isCallingInviteAction = false
      if(!isJoining) {
        // navigate to project listing and reload projects
        this.props.loadProjects({ sort: 'updatedAt desc' })
        this.props.history.push('/projects/')
      } else {
        if (this.shouldForceCallAcceptRefuseRequest(this.props)) {
          // remove query param
          this.props.history.replace(`/projects/${this.props.match.params.projectId}`)
        }
        this.props.loadProjectDashboard(this.props.match.params.projectId)
      }
    }).catch(err => {
      this.isCallingInviteAction = false
      // show code bot error if invite fail
      acceptOrRefuseInviteFail(err)
    })
  }

  /**
   * Check if we should force call accept or refuse invite request
   */
  shouldForceCallAcceptRefuseRequest() {
    const queryUrlParams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    if (queryUrlParams.invitation && _.includes(['accept', 'decline'], queryUrlParams.invitation) ) {
      return true
    }
    return false
  }

  render() {
    const { error } = this.props
    const currentMemberRole = this.getProjectRoleForCurrentUser(this.props)
    const adminRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
    const isSuperUser = this.props.currentUserRoles.some((role) => adminRoles.indexOf(role) !== -1)
    const powerRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER]
    const isManageUser = this.props.currentUserRoles.some((role) => powerRoles.indexOf(role) !== -1)
    const isCustomerUser = !(isManageUser || isSuperUser)
    const showUserInvited = this.props.showUserInvited
    if (showUserInvited && this.shouldForceCallAcceptRefuseRequest(this.props)) {
      if (error) {
        // show codebbot error
        return (<EnhancedProjectDetailView {...this.props}/>)
      }
      return (<LoadingIndicator />)
    }
    return (
      !showUserInvited?
        <EnhancedProjectDetailView
          {...this.props}
          currentMemberRole={currentMemberRole}
          isSuperUser={isSuperUser}
          isManageUser={isManageUser}
          isCustomerUser={isCustomerUser}
        />:
        <Dialog
          onCancel={() => this.onUserInviteAction(false)}
          onConfirm={() => this.onUserInviteAction(true)}
          title={JOIN_INVITE_TITLE}
          content={JOIN_INVITE_MESSAGE}
          buttonText="Join project"
          buttonColor="blue"
        />
    )
  }
}

const mapStateToProps = ({projectState, projectDashboard, loadUser, productsTimelines, templates}) => {
  const templateId = (projectState.project || {}).templateId
  const { projectTemplates, productTemplates } = templates
  return {
    currentUserId: parseInt(loadUser.user.id),
    currentUserEmail: loadUser.user.email,
    isLoading: projectDashboard.isLoading,
    isProcessing: projectState.processing,
    error: projectState.inviteError ? projectState.inviteError : projectState.error,
    project: projectState.project,
    projectNonDirty: projectState.projectNonDirty,
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
    currentUserRoles: loadUser.user.roles,
    showUserInvited: projectState.showUserInvited
  }
}

const mapDispatchToProps = { loadProjectDashboard, clearLoadedProject, acceptOrRefuseInvite, loadProjects, acceptOrRefuseInviteFail }

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
