import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import uncontrollable from 'uncontrollable'
import './TeamManagement.scss'
import ProjectDialog from './ProjectManagementDialog'
import TopcoderDialog from './TopcoderManagementDialog'
import UserTooltip from '../User/UserTooltip'
import AddIcon from  '../../assets/icons/icon-ui-bold-add.svg'
import Dialog from './Dialog'

const userShape = PropTypes.shape({
  userId: PropTypes.number.isRequired,
  handle: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
  role: PropTypes.string,
  isPrimary: PropTypes.bool,
  isManager: PropTypes.bool,
  isCopilot: PropTypes.bool,
  isCustomer: PropTypes.bool
})

const REMOVE_INVITATION_TITLE = 'You\'re about to remove an invitation'
const REMOVE_TITLE = 'You\'re about to delete a member from the team'
const LEAVE_TITLE = 'You\'re about to leave the project'
const JOIN_INVITE_TITLE = 'You\'re invited to join this project'

const JOIN_INVITE_MESSAGE = `Once you join the team you will be able to see the project details,
  collaborate on project specification and monitor the progress of all deliverables`

const LEAVE_MESSAGE = `Once you leave, somebody on your team has to add you for you to be
  for you to be able to see the project. Do you stil want to leave?`

const JOIN_MESSAGE = `You are about to join the project.
  Once you join you'll be responsible for carring over all the orders from Darth Vandar.
  Are you sure you want to join?`

const REMOVE_USER_MESSAGE = `You are about to remove <span style="font-weight: 600;">USERNAME</span> from your team.
  They will lose all rights to the project and can't see or interact with it anymore.
  Do you still want to remove the member?`

const REMOVE_INVITE_MESSAGE = `Once you cancel the invitation for <span style="font-weight: 600;">
  USEREMAIL</span> they won't be able to access the project. You will have to invite them again
  in order for them to gain access`

class TeamManagement extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.processingMembers !== nextProps.processingMembers && (!nextProps.processingMembers)) {
      this.props.onJoin(false)
      this.props.onMemberDelete(null)
    }
    if (this.props.processingInvites !== nextProps.processingInvites && (!nextProps.processingInvites)) {
      this.props.onDeleteInvite(null)
    }
  }

  render() {
    const {
      currentUser, members, deletingMember, isAddingTeamMember, onMemberDeleteConfirm, onMemberDelete, isShowJoin,
      showNewMemberConfirmation, onJoin, onJoinConfirm, onShowProjectDialog, isShowProjectDialog,
      projectTeamInvites, onProjectInviteDeleteConfirm, onProjectInviteSend, deletingInvite,
      onDeleteInvite, isShowTopcoderDialog, onShowTopcoderDialog, processingInvites, processingMembers,
      onTopcoderInviteSend, onTopcoderInviteDeleteConfirm, topcoderTeamInvites, showUserInvited, onUserInviteAction
    } = this.props
    const currentMember = members.filter((member) => member.userId === currentUser.userId)[0]
    const modalActive = isAddingTeamMember || deletingMember || isShowJoin || showNewMemberConfirmation || deletingInvite

    const customerTeamManageAction = (currentUser.isCustomer || currentUser.isAdmin) ||
      (currentMember && currentUser.isManager)
    const customerTeamViewAction = !customerTeamManageAction
    const topcoderTeamManageAction = currentUser.isAdmin || (currentMember && currentUser.isManager)
    const topcoderTeamViewAction = !topcoderTeamManageAction
    const canJoinAsCopilot = !currentMember && currentUser.isCopilot
    const canJoinAsManager = !currentMember && currentUser.isManager
    const canShowInvite = currentMember && (currentUser.isCustomer || currentMember.isCopilot || currentMember.isManager)

    const sortedMembers = members

    return (
      <div className="team-management-container">
        <div className="projects-team">
          <div className="title">
            Project Team
            {(customerTeamManageAction || customerTeamViewAction) &&
              <span className="title-action" onClick={() => onShowProjectDialog(true)}>
                {customerTeamViewAction ? 'View' : 'Manage'}
              </span>
            }
          </div>
          <div className="members">
            {sortedMembers.map((member, i) => {
              if (!member.isCustomer) {
                return
              }
              return (
                <UserTooltip usr={member} id={i} key={i} previewAvatar size={40} />
              )
            })}
            { (canShowInvite) &&
              <div className="join-btn" onClick={() => onShowProjectDialog(true)}>
                <AddIcon />
                Invite people
              </div>
            }
          </div>
        </div>
        <div className="projects-team">
          <div className="title">
            Topcoder
            {(topcoderTeamManageAction || topcoderTeamViewAction) &&
              <span className="title-action" onClick={() => onShowTopcoderDialog(true)}>
                {topcoderTeamViewAction ? 'View' : 'Manage'}
              </span>
            }
          </div>
          <div className="members">
            {sortedMembers.map((member, i) => {
              if (member.isCustomer) {
                return
              }
              return (
                <UserTooltip usr={member} id={i} key={i} previewAvatar size={40} />
              )
            })}
            { (canJoinAsCopilot || canJoinAsManager) &&
              <div className="join-btn" onClick={() => onJoin(true)}>
                <AddIcon />
                {canJoinAsCopilot ? 'Join project as copilot' : 'Join project'}
              </div>
            }
          </div>
        </div>
        {isShowJoin && ((() => {
          const onClickCancel = () => onJoin(false)
          const onClickJoinConfirm = () => {
            onJoinConfirm()
          }
          return (
            <Dialog
              disabled={processingMembers}
              onCancel={onClickCancel}
              onConfirm={onClickJoinConfirm}
              title={`Join project as ${currentUser.isCopilot ? 'Copilot' : 'Manager'}`}
              content={JOIN_MESSAGE}
              buttonText="Join project"
              buttonColor="blue"
            />
          )
        })())}
        {(!modalActive && isShowProjectDialog) && ((() => {
          const onClickCancel = () => onShowProjectDialog(false)
          const removeMember = (member) => {
            onMemberDelete(member)
          }
          const removeInvite = (item) => {
            onDeleteInvite({item, type: 'project'})
          }
          return (
            <ProjectDialog
              processingInvites={processingInvites}
              currentUser={currentUser}
              members={members}
              isMember={!!currentMember}
              onCancel={onClickCancel}
              removeMember={removeMember}
              invites={projectTeamInvites}
              sendInvite={onProjectInviteSend}
              removeInvite={removeInvite}
            />
          )
        })())}
        {(!modalActive && isShowTopcoderDialog) && ((() => {
          const onClickCancel = () => onShowTopcoderDialog(false)
          const removeMember = (member) => {
            onMemberDelete(member)
          }
          const removeInvite = (item) => {
            onDeleteInvite({item, type: 'topcoder'})
          }
          return (
            <TopcoderDialog
              processingInvites={processingInvites}
              currentUser={currentUser}
              members={members}
              isMember={!!currentMember}
              onCancel={onClickCancel}
              removeMember={removeMember}
              addUsers={onTopcoderInviteSend}
              invites={topcoderTeamInvites}
              removeInvite={removeInvite}
            />
          )
        })())}
        {deletingMember && ((() => {
          const onClickCancel = () => onMemberDelete(null)
          const onClickConfirm = () => {
            onMemberDeleteConfirm(deletingMember)
          }
          const firstName = _.get(deletingMember, 'firstName', '')
          const lastName = _.get(deletingMember, 'lastName', '')
          let userFullName = `${firstName} ${lastName}`
          userFullName = userFullName.trim().length > 0 ? userFullName : 'Connect user'
          const isCurrentUser = (currentUser.userId === deletingMember.userId)
          const title = isCurrentUser ? LEAVE_TITLE : REMOVE_TITLE
          const content = isCurrentUser ? LEAVE_MESSAGE : REMOVE_USER_MESSAGE.replace('USERNAME', userFullName)
          const buttonText = isCurrentUser ? 'Leave project' : 'Remove member'
          return (
            <Dialog
              disabled={processingMembers}
              onCancel={onClickCancel}
              onConfirm={onClickConfirm}
              title={title}
              content={content}
              buttonText={buttonText}
              buttonColor="red"
            />
          )
        })())}
        {deletingInvite && ((() => {
          const onClickCancel = () => onDeleteInvite(null)
          const onClickConfirm = () => {
            if (deletingInvite.type === 'project') {
              onProjectInviteDeleteConfirm(deletingInvite.item)
            } else {
              onTopcoderInviteDeleteConfirm(deletingInvite.item)
            }
          }
          return (
            <Dialog
              disabled={processingInvites}
              onCancel={onClickCancel}
              onConfirm={onClickConfirm}
              title={REMOVE_INVITATION_TITLE}
              content={REMOVE_INVITE_MESSAGE.replace('USEREMAIL', deletingInvite.item)}
              buttonText="Remove invitation"
              buttonColor="red"
            />
          )
        })())}
        {showUserInvited && (() => {
          const onClickCancel = () => onUserInviteAction(false)
          const onClickConfirm = () => onUserInviteAction(true)
          return (
            <Dialog
              onCancel={onClickCancel}
              onConfirm={onClickConfirm}
              title={JOIN_INVITE_TITLE}
              content={JOIN_INVITE_MESSAGE}
              buttonText="Join project"
              buttonColor="blue"
            />
          )
        })()}
      </div>
    )
  }
}

TeamManagement.propTypes = {
  /**
   * The current logged in user in the app.
   * Used to determinate "You" label and access
   */
  currentUser: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    isManager: PropTypes.bool,
    isCopilot: PropTypes.bool
  }).isRequired,

  /**
   * The error message
   */
  error: PropTypes.string,

  /**
   * The list of all project members
   */
  members: PropTypes.arrayOf(userShape).isRequired,

  /**
   * The current deleting member. When defined a confirmation overlay will be displayed
   */
  deletingMember: PropTypes.object,

  /**
   * Callback fired if member delete must be confirmed
   * If confirmation is cancelled, member will be null
   *
   * function (
   *  User? member,
   *  SyntheticEvent event?
   * )
   */
  onMemberDelete: PropTypes.func.isRequired,

  /**
   * Callback fired when delete is confirmed
   *
   * function (
   *  User member,
   *  SyntheticEvent event?
   * )
   */
  onMemberDeleteConfirm: PropTypes.func.isRequired,

  /**
   * The flag if join confirmation is visible
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  isShowJoin: PropTypes.bool,

  /**
   * Callback fired when join confirmation popup is toggled
   *
   * function (
   *  Boolean isShowJoin,
   *  SyntheticEvent event?
   * )
   */
  onJoin: PropTypes.func.isRequired,

  /**
   * Callback fired when user confirmed join
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  onJoinConfirm: PropTypes.func.isRequired,

  /**
   * The flag if project dialog is visible
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  isShowProjectDialog: PropTypes.bool,

  /**
   * Callback fired when project dialog is toggled
   * function (
   *  SyntheticEvent event?
   * )
   */
  onShowProjectDialog: PropTypes.func,

  /**
   * Callback to send email invitations
   */
  onProjectInviteSend: PropTypes.func,

  /**
   * Callback to send topcoder invitations
   */
  onTopcoderInviteSend: PropTypes.func,

  /**
   * Callback to delete email invitation
   */
  onProjectInviteDeleteConfirm: PropTypes.func,

  /**
   * Callback to delete topcoder invitations
   */
  onTopcoderInviteDeleteConfirm: PropTypes.func,

  /**
   * List of users invited via mail
   */
  projectTeamInvites: PropTypes.arrayOf(PropTypes.object),

  /**
   * List of topcoder users invited
   */
  topcoderTeamInvites: PropTypes.arrayOf(PropTypes.object),

  /**
   * Flag indicates if members API is running
   */
  processingMembers: PropTypes.bool.isRequired,

  /**
   * Flag indicates if invite API is running
   */
  processingInvites: PropTypes.bool.isRequired,

  /**
   * Flag indicates if user invited dialog must be shown
   */
  showUserInvited: PropTypes.bool,

  /**
   * Callback to set the accept or reject status of invite
   */
  onUserInviteAction: PropTypes.func,
}

export default uncontrollable(TeamManagement, {
  deletingMember: 'onMemberDelete',
  isShowJoin: 'onJoin',
  isShowProjectDialog: 'onShowProjectDialog',
  isShowTopcoderDialog: 'onShowTopcoderDialog',
  deletingInvite: 'onDeleteInvite',
  isInvited: 'onInviteAcceptShow'
})
