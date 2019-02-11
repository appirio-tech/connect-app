import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import {
  ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN,
  PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_CUSTOMER, ROLE_CONNECT_COPILOT_MANAGER,
} from '../../../config/constants'
import TeamManagement from '../../../components/TeamManagement/TeamManagement'
import { addProjectMember, updateProjectMember, removeProjectMember,
  loadMemberSuggestions, inviteProjectMembers, deleteProjectInvite,
  inviteTopcoderMembers, deleteTopcoderMemberInvite, acceptOrRefuseInvite
} from '../../actions/projectMember'

class TeamManagementContainer extends Component {

  constructor(props) {
    super(props)
    this.onProjectInviteSend = this.onProjectInviteSend.bind(this)
    this.onProjectInviteDelete = this.onProjectInviteDelete.bind(this)
    this.onTopcoderInviteDelete = this.onTopcoderInviteDelete.bind(this)
    this.onTopcoderInviteSend = this.onTopcoderInviteSend.bind(this)
    this.onMemberDeleteConfirm = this.onMemberDeleteConfirm.bind(this)
    this.onJoinConfirm = this.onJoinConfirm.bind(this)
    this.changeRole = this.changeRole.bind(this)
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
      // navigate to project listing
      this.props.history.push('/projects/')
    }
  }

  onMemberDeleteConfirm(member) {
    // is user leaving current project
    const isLeaving = member.userId === this.props.currentUser.userId
    this.props.removeProjectMember(this.props.projectId, member.id, isLeaving)
    this.setState({ isUserLeaving: isLeaving })
  }

  onJoinConfirm() {
    const { currentUser, projectId, addProjectMember } = this.props
    const role = currentUser.isCopilot ? PROJECT_ROLE_COPILOT : PROJECT_ROLE_MANAGER
    addProjectMember(
      projectId,
      { userId: currentUser.userId, role }
    )
  }

  onTopcoderInviteDelete(invite) {
    this.props.deleteTopcoderMemberInvite(this.props.projectId, invite)
  }

  onTopcoderInviteSend(items) {
    this.props.inviteTopcoderMembers(this.props.projectId, items)
  }

  onProjectInviteDelete(invite) {
    this.props.deleteProjectInvite(this.props.projectId, invite)
  }

  onProjectInviteSend(emails, handles) {
    this.props.inviteProjectMembers(this.props.projectId, emails, handles)
  }

  changeRole(memberId, item) {
    this.props.updateProjectMember(this.props.projectId, memberId, item)
  }

  anontateMemberProps() {
    const { members, allMembers } = this.props
    // fill project members from state.members object
    return _.map(members, m => {
      if (!m.userId) return m
      // map role
      switch (m.role) {
      case PROJECT_ROLE_COPILOT:
        m.isCopilot = true
        break
      case PROJECT_ROLE_CUSTOMER:
        m.isCustomer = true
        m.isPrimary = m.isPrimary || false
        break
      case PROJECT_ROLE_MANAGER:
        m.isManager = true
        break
      }
      return _.assign({}, m, {
        photoURL: ''
      },
      _.find(allMembers, mem => mem.userId === m.userId))
    })
  }

  annotateInvites(invites, members){
    return _.map(invites, i => {
      i.member = _.find(members, m => m.userId === i.userId)
      return i
    })
  }

  render() {
    const projectMembers = this.anontateMemberProps()
    const projectTeamInvites = this.annotateInvites(this.props.projectTeamInvites, this.props.allMembers)
    const topcoderTeamInvites = this.annotateInvites(this.props.topcoderTeamInvites, this.props.allMembers)
    return (
      <div>
        <TeamManagement
          {...this.state}
          onUserInviteAction={this.onUserInviteAction}
          processingMembers={this.props.processingMembers}
          processingInvites={this.props.processingInvites}
          error={this.props.error}
          currentUser={this.props.currentUser}
          members={projectMembers}
          projectTeamInvites={projectTeamInvites}
          topcoderTeamInvites={topcoderTeamInvites}
          onMemberDeleteConfirm={this.onMemberDeleteConfirm}
          onJoinConfirm={this.onJoinConfirm}
          onProjectInviteDeleteConfirm={this.onProjectInviteDelete}
          onProjectInviteSend={this.onProjectInviteSend}
          onTopcoderInviteDeleteConfirm={this.onTopcoderInviteDelete}
          onTopcoderInviteSend={this.onTopcoderInviteSend}
          changeRole={this.changeRole}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ loadUser, members, projectState }) => {
  const adminRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  const powerUserRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  const managerRoles = [ ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN, ROLE_CONNECT_MANAGER ]
  return {
    currentUser: {
      userId: parseInt(loadUser.user.id),
      isCopilot: _.indexOf(loadUser.user.roles, ROLE_CONNECT_COPILOT) > -1,
      isAdmin: _.intersection(loadUser.user.roles, adminRoles).length > 0,
      isManager: loadUser.user.roles.some((role) => managerRoles.indexOf(role) !== -1),
      isCustomer: !loadUser.user.roles.some((role) => powerUserRoles.indexOf(role) !== -1),
      isCopilotManager: _.indexOf(loadUser.user.roles, ROLE_CONNECT_COPILOT_MANAGER) > -1,
    },
    allMembers: _.values(members.members),
    processingInvites: projectState.processingInvites,
    processingMembers: projectState.processingMembers,
    error: projectState.error,
    topcoderTeamInvites: _.filter(projectState.project.invites, i => i.role !== 'customer'),
    projectTeamInvites: _.filter(projectState.project.invites, i => i.role === 'customer')
  }
}

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
}

TeamManagementContainer.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    isManager: PropTypes.bool,
    isCustomer: PropTypes.bool,
    isCopilot: PropTypes.bool
  }).isRequired,
  allMembers: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectId: PropTypes.number.isRequired,
  processingMembers: PropTypes.bool.isRequired,
  processingInvites: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  projectTeamInvites: PropTypes.arrayOf(PropTypes.object),
  topcoderTeamInvites: PropTypes.arrayOf(PropTypes.object),
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamManagementContainer))
