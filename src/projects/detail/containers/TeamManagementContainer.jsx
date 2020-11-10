import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import _ from 'lodash'
import {
  PROJECT_ROLE_MANAGER,
} from '../../../config/constants'
import TeamManagement from '../../../components/TeamManagement/TeamManagement'
import {
  acceptOrRefuseInvite,
  addProjectMember,
  deleteProjectInvite,
  deleteTopcoderMemberInvite,
  inviteProjectMembers,
  inviteTopcoderMembers,
  loadMemberSuggestions,
  removeProjectMember,
  updateProjectMember
} from '../../actions/projectMember'
import { loadProjects } from '../../actions/loadProjects'

class TeamManagementContainer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedMembers: [],
    }

    this.onProjectInviteSend = this.onProjectInviteSend.bind(this)
    this.onCopilotInviteSend = this.onCopilotInviteSend.bind(this)
    this.onProjectInviteDelete = this.onProjectInviteDelete.bind(this)
    this.onTopcoderInviteDelete = this.onTopcoderInviteDelete.bind(this)
    this.onTopcoderInviteSend = this.onTopcoderInviteSend.bind(this)
    this.onMemberDeleteConfirm = this.onMemberDeleteConfirm.bind(this)
    this.onJoinConfirm = this.onJoinConfirm.bind(this)
    this.onAcceptOrRefuse = this.onAcceptOrRefuse.bind(this)
    this.changeRole = this.changeRole.bind(this)
    this.onSelectedMembersUpdate = this.onSelectedMembersUpdate.bind(this)
    this.onShowDialog = this.onShowDialog.bind(this)
  }

  componentWillMount() {
    this.setState({
      isUserLeaving: false,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isUserLeaving &&
      _.findIndex(nextProps.members,
        m => m.userId === this.props.currentUser.userId) === -1
    ) {
      // navigate to project listing and reload projects
      this.props.loadProjects({ sort: 'updatedAt desc' })
      this.props.history.push('/projects/')
    }
    const {processingInvites} = this.props
    if (processingInvites && !nextProps.processingInvites && !nextProps.error ) {
      this.resetSelectedMembers()
    }
  }

  onMemberDeleteConfirm(member) {
    // is user leaving current project
    const isLeaving = member.userId === this.props.currentUser.userId
    this.props.removeProjectMember(this.props.projectId, member.id, isLeaving)
    this.setState({isUserLeaving: isLeaving})
  }

  /**
   * Member joins themself.
   *
   * Currently only used to by managers to join Topcoder Team.
   *
   * @param {string} role role to join with
   */
  onJoinConfirm(role = PROJECT_ROLE_MANAGER) {
    const { currentUser, projectId, addProjectMember } = this.props
    addProjectMember(
      projectId,
      {userId: currentUser.userId, role}
    )
  }

  onTopcoderInviteDelete(invite) {
    this.props.deleteTopcoderMemberInvite(this.props.projectId, invite)
  }

  onTopcoderInviteSend() {
    const {handles, emails } = this.getEmailsAndHandles()
    this.props.inviteTopcoderMembers(this.props.projectId, {role: 'manager', handles, emails})
  }

  onProjectInviteDelete(invite) {
    this.props.deleteProjectInvite(this.props.projectId, invite)
  }

  onProjectInviteSend() {
    const {handles, emails} = this.getEmailsAndHandles()
    this.props.inviteProjectMembers(this.props.projectId, emails, handles)
  }

  onCopilotInviteSend() {
    const {handles, emails} = this.getEmailsAndHandles()
    this.props.inviteTopcoderMembers(this.props.projectId, { role: 'copilot', handles, emails })
  }

  onAcceptOrRefuse(invite) {
    return this.props.acceptOrRefuseInvite(this.props.projectId, invite)
  }

  changeRole(memberId, item) {
    this.props.updateProjectMember(this.props.projectId, memberId, item)
  }

  onSelectedMembersUpdate(selectedMembers) {
    this.setState({selectedMembers})
  }

  resetSelectedMembers() {
    this.onSelectedMembersUpdate([])
  }

  onShowDialog(visible) {
    if(!visible) {
      this.resetSelectedMembers()
    }
  }

  getEmailsAndHandles() {
    const {selectedMembers} = this.state
    const handles = []
    const emails = []
    selectedMembers.map(selectedOption => {
      const value = selectedOption.label
      // Test if its email
      if (selectedOption.isEmail) {
        emails.push(value)
      } else {
        handles.push(value)
      }
    })
    return {emails, handles}
  }


  render() {
    const {projectTeamInvites, topcoderTeamInvites, copilotTeamInvites } = this.props
    return (
      <div>
        <TeamManagement
          {...this.state}
          history={this.props.history}
          onUserInviteAction={this.onUserInviteAction}
          processingMembers={this.props.processingMembers}
          updatingMemberIds={this.props.updatingMemberIds}
          processingInvites={this.props.processingInvites}
          error={this.props.error}
          currentUser={this.props.currentUser}
          members={this.props.members}
          allMembers={this.props.allMembers}
          projectTeamInvites={projectTeamInvites}
          topcoderTeamInvites={topcoderTeamInvites}
          copilotTeamInvites={copilotTeamInvites}
          onMemberDeleteConfirm={this.onMemberDeleteConfirm}
          onJoinConfirm={this.onJoinConfirm}
          onProjectInviteDeleteConfirm={this.onProjectInviteDelete}
          onAcceptOrRefuse={this.onAcceptOrRefuse}
          onProjectInviteSend={this.onProjectInviteSend}
          onCopilotInviteSend={this.onCopilotInviteSend}
          onTopcoderInviteDeleteConfirm={this.onTopcoderInviteDelete}
          onTopcoderInviteSend={this.onTopcoderInviteSend}
          changeRole={this.changeRole}
          onSelectedMembersUpdate={this.onSelectedMembersUpdate}
          selectedMembers={this.state.selectedMembers}
          onShowTopcoderDialog={this.onShowDialog}
          onShowProjectDialog={this.onShowDialog}
        />
      </div>
    )
  }
}

const mapStateToProps = ({loadUser, members, projectState}) => ({
  currentUser: {
    userId: parseInt(loadUser.user.id),
  },
  allMembers: _.values(members.members),
  processingInvites: projectState.processingInvites,
  processingMembers: projectState.processingMembers,
  updatingMemberIds: projectState.updatingMemberIds,
  error: projectState.error,
  topcoderTeamInvites: _.filter(projectState.project.invites, i => i.role !== 'customer' && i.role !== 'copilot'),
  copilotTeamInvites: _.filter(projectState.project.invites, i => i.role === 'copilot'),
  projectTeamInvites: _.filter(projectState.project.invites, i => i.role === 'customer')
})

const mapDispatchToProps = {
  addProjectMember,
  removeProjectMember,
  updateProjectMember,
  loadMemberSuggestions,
  inviteProjectMembers,
  deleteProjectInvite,
  inviteTopcoderMembers,
  deleteTopcoderMemberInvite,
  acceptOrRefuseInvite,
  loadProjects,
}

TeamManagementContainer.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.number.isRequired,
  }).isRequired,
  allMembers: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectId: PropTypes.number.isRequired,
  processingMembers: PropTypes.bool.isRequired,
  updatingMemberIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  processingInvites: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  projectTeamInvites: PropTypes.arrayOf(PropTypes.object),
  topcoderTeamInvites: PropTypes.arrayOf(PropTypes.object),
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamManagementContainer))
