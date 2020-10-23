
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import qs from 'query-string'
import { renderComponent, branch, compose, withProps } from 'recompose'
import { loadProjectDashboard } from '../actions/projectDashboard'
import { clearLoadedProject } from '../actions/project'
import { acceptOrRefuseInvite } from '../actions/projectMember'
import { loadProjects } from '../actions/loadProjects'
import { getEmptyProjectObject } from '../reducers/project'

import {
  LOAD_PROJECT_FAILURE,
  PROJECT_MEMBER_INVITE_STATUS_ACCEPTED, PROJECT_MEMBER_INVITE_STATUS_REFUSED, ACCEPT_OR_REFUSE_INVITE_FAILURE
} from '../../config/constants'
import spinnerWhileLoading from '../../components/LoadingSpinner'
import CoderBot from '../../components/CoderBot/CoderBot'
import { getProjectProductTemplates, getProjectTemplateById } from '../../helpers/templates'
import Dialog from '../../components/TeamManagement/Dialog'
import { getProductEstimate } from '../../config/projectWizard'
import { getProfileSettings, saveProfileSettings } from '../../routes/settings/actions'
import { formatProfileSettings } from '../../routes/settings/helpers/settings'
import { isUserProfileComplete } from '../../helpers/tcHelpers'
import IncompleteUserProfileDialog from '../../components/IncomepleteUserProfileDialog/IncompleteUserProfileDialog'


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
  !props.isLoading &&
  // also wait until user profile is loaded to make sure we are showing incomplete user profile popup first, before showing project details
  !props.profileSettings.isLoading && (
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
  const template = _.get(props.projectTemplate, 'scope', {})
  let estimationQuestion = null
  const { estimateBlocks } = getProductEstimate({scope: template}, props.project)

  // we can hide estimation component just by setting `hideEstimation` inside Project Template
  // also, if there are no `estimateBlocks` found we also don't show estimation component
  if (!template.hideEstimation && estimateBlocks.length > 0){
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

    this.state = {
      isCallingInviteAction: false,
      isUserAcceptedInvitation: undefined,
      shouldForceCallAcceptRefuseRequest: false,
      showIncompleteProfilePopup: false,
    }

    this.onUserInviteAction = this.onUserInviteAction.bind(this)
  }

  componentWillMount() {
    const projectId = this.props.match.params.projectId
    this.props.loadProjectDashboard(projectId)
    // to check if user profile is complete or no
    this.props.getProfileSettings()

    // set flag that we have to force invitation action from the beginning
    // so we can show appropriate loading indicator as soon as possible
    const invitationQueryParamValue = this.getInvitationQueryParamValue()
    if (!_.isUndefined(invitationQueryParamValue)) {
      this.setState({
        shouldForceCallAcceptRefuseRequest: true,
        isUserAcceptedInvitation: invitationQueryParamValue === 'accept'
      })
    }
  }

  componentWillUnmount() {
    this.props.clearLoadedProject()
  }

  componentWillReceiveProps(nextProps) {
    const {isProcessing, isLoading, error, project, match, showUserInvited, profileSettings} = nextProps
    // handle just deleted projects
    if (! (error || isLoading || isProcessing) && _.isEqual(getEmptyProjectObject(), project))
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

    // in case we have force automatic invite accept/decline
    // track the moment when we load invites when `showUserInvited` is no `undefined` anymore
    // and we have invite, then trigger action
    // if there is no invite, then silently remove invite query param
    if (_.isUndefined(this.props.showUserInvited) && !_.isUndefined(showUserInvited) && this.state.shouldForceCallAcceptRefuseRequest) {
      if (showUserInvited) {
        const invitationQueryParamValue = this.getInvitationQueryParamValue()
        this.onUserInviteAction(invitationQueryParamValue === 'accept')
      } else {
        this.props.history.replace(`/projects/${this.props.match.params.projectId}`)
        this.setState({
          shouldForceCallAcceptRefuseRequest: false,
          isUserAcceptedInvitation: undefined
        })
      }
    }

    // as soon as user profile settings are loaded, check if all required fields are completed or show the popup
    if (this.props.profileSettings.isLoading && !profileSettings.isLoading && !isUserProfileComplete(nextProps.currentUser, profileSettings.settings)) {
      this.setState({ showIncompleteProfilePopup: true })
    }

    // as soon as user profile is updated and complete, close the popup
    if (this.props.profileSettings.pending && !profileSettings.pending && isUserProfileComplete(nextProps.currentUser, profileSettings.settings)) {
      this.setState({ showIncompleteProfilePopup: false })
    }
  }

  onUserInviteAction(isUserAcceptedInvitation) {
    if (this.state.isCallingInviteAction) {
      return
    }
    const { acceptOrRefuseInvite } = this.props
    this.setState({
      isCallingInviteAction: true,
      isUserAcceptedInvitation,
    })
    acceptOrRefuseInvite(this.props.match.params.projectId, {
      id: this.props.userInvitationId,
      status: isUserAcceptedInvitation ? PROJECT_MEMBER_INVITE_STATUS_ACCEPTED : PROJECT_MEMBER_INVITE_STATUS_REFUSED
    })
      .then(() => {
        if (!isUserAcceptedInvitation) {
          // navigate to project listing and reload projects
          this.props.loadProjects({ sort: 'updatedAt desc' })
          this.props.history.push('/projects?sort=updatedAt%20desc')
        } else {
          // if we have query param to enforce invite accept/decline - remove the params when invite accepted
          if (this.state.shouldForceCallAcceptRefuseRequest) {
            this.props.history.replace(`/projects/${this.props.match.params.projectId}`)
          }
          this.props.loadProjectDashboard(this.props.match.params.projectId)
        }
        this.setState({
          isCallingInviteAction: false,
          // as soon as invite action is done, disable flag for forcing invite action
          shouldForceCallAcceptRefuseRequest: false
        })
      }).catch(() => {
        this.setState({ isCallingInviteAction: false })
      })
  }

  /**
   * Get the value of `invitation` query param.
   *
   * @returns {String} value of `invitation` query param
   */
  getInvitationQueryParamValue() {
    const queryUrlParams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

    return queryUrlParams.invitation
  }

  render() {
    const { inviteError, project, profileSettings, currentUser, saveProfileSettings } = this.props
    const { isCallingInviteAction, isUserAcceptedInvitation, shouldForceCallAcceptRefuseRequest } = this.state
    const showUserInvited = this.props.showUserInvited

    return (
      ((showUserInvited || shouldForceCallAcceptRefuseRequest) && !inviteError || isCallingInviteAction) ? (
        <Dialog
          onCancel={() => this.onUserInviteAction(false)}
          onConfirm={() => this.onUserInviteAction(true)}
          title={JOIN_INVITE_TITLE}
          loadingTitle={isUserAcceptedInvitation ? 'Adding you to the project....' : 'Declining invitation...'}
          content={JOIN_INVITE_MESSAGE}
          buttonText="Join project"
          buttonColor="blue"
          isLoading={isCallingInviteAction || shouldForceCallAcceptRefuseRequest}
        />
      ) : (
        <div>
          {this.state.showIncompleteProfilePopup && (
            <IncompleteUserProfileDialog
              profileSettings={profileSettings}
              saveProfileSettings={saveProfileSettings}
              user={currentUser}
              onCloseDialog={() => { this.setState({ showIncompleteProfilePopup: false })}}
              title={`Welcome to ${project.name}`}
            />
          )}
          <EnhancedProjectDetailView
            {...this.props}
          />
        </div>
      )
    )
  }
}

const mapStateToProps = ({projectState, projectDashboard, loadUser, productsTimelines, templates, settings}) => {
  const templateId = (projectState.project || {}).templateId
  const { projectTemplates, productTemplates } = templates
  return {
    currentUser: loadUser.user,
    currentUserId: parseInt(loadUser.user.id),
    currentUserEmail: loadUser.user.email,
    isLoading: projectDashboard.isLoading,
    isProcessing: projectState.processing,
    error: projectState.inviteError ? projectState.inviteError : projectState.error,
    inviteError: projectState.inviteError,
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
    showUserInvited: projectState.showUserInvited,
    userInvitationId: projectState.userInvitationId,
    profileSettings: {
      ...settings.profile,
      settings: formatProfileSettings(settings.profile.traits)
    },
  }
}

const mapDispatchToProps = { loadProjectDashboard, clearLoadedProject, acceptOrRefuseInvite, loadProjects, getProfileSettings, saveProfileSettings }

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
