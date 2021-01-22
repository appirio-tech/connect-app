import React from 'react'
import PropTypes from 'prop-types'
import uncontrollable from 'uncontrollable'
import './TeamManagement.scss'
import ProjectDialog from './ProjectManagementDialog'
import CopilotDialog from './CopilotManagementDialog'
import TopcoderDialog from './TopcoderManagementDialog'
import MemberItem from './MemberItem'
import AddIcon from  '../../assets/icons/icon-ui-bold-add.svg'
import Dialog from './Dialog'
import { PERMISSIONS } from '../../config/permissions'
import {hasPermission} from '../../helpers/permissions'
import { getFullNameWithFallback } from '../../helpers/tcHelpers'

const userShape = PropTypes.shape({
  userId: PropTypes.number.isRequired,
  handle: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
  role: PropTypes.string,
  isPrimary: PropTypes.bool
})

const REMOVE_INVITATION_TITLE = 'You\'re about to remove an invitation'
const REMOVE_TITLE = 'You\'re about to delete a member from the team'
const LEAVE_TITLE = 'You\'re about to leave the project'

const LEAVE_MESSAGE = `Once you leave, somebody on your team has to add you back to the team for you to be able to see the project.
  Do you still want to leave?`

const JOIN_MESSAGE = `You are about to join the project. Once you join you will be responsible for project delivery.
  Are you sure you want to join?`

const REMOVE_USER_MESSAGE = `You are about to remove <span style="font-weight: 600;">USERNAME</span> from your team.
  They will lose all rights to the project and can't see or interact with it anymore.
  Do you still want to remove the member?`

const REMOVE_INVITE_MESSAGE = `Once you cancel the invitation for <span style="font-weight: 600;">
  USEREMAIL</span> they won't be able to access the project. You will have to invite them again
  in order for them to gain access`

class TeamManagement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topcoderTeamInviteButtonExpanded: false,
      projectTeamInviteButtonExpanded: false,
      copilotTeamInviteButtonExpanded: false,
    }
    this.projectTeamInviteButtonClick = this.projectTeamInviteButtonClick.bind(this)
    this.topcoderTeamInviteButtonClick = this.topcoderTeamInviteButtonClick.bind(this)
    this.copilotTeamInviteButtonClick = this.copilotTeamInviteButtonClick.bind(this)
    this.onJoinConfirm = this.onJoinConfirm.bind(this)
  }

  topcoderTeamInviteButtonClick() {
    this.refreshStickyComp()
    this.setState({topcoderTeamInviteButtonExpanded: !this.state.topcoderTeamInviteButtonExpanded})
  }

  projectTeamInviteButtonClick() {
    this.refreshStickyComp()
    this.setState({projectTeamInviteButtonExpanded: !this.state.projectTeamInviteButtonExpanded})
  }

  copilotTeamInviteButtonClick() {
    this.refreshStickyComp()
    this.setState({copilotTeamInviteButtonExpanded: !this.state.copilotTeamInviteButtonExpanded})
  }

  refreshStickyComp() {
    const event = document.createEvent('Event')
    event.initEvent('refreshsticky', true, true)
    document.dispatchEvent(event)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.processingMembers !== nextProps.processingMembers && (!nextProps.processingMembers)) {
      this.props.onJoin(false)
      this.props.onMemberDelete(null)
    }
    if (this.props.processingInvites !== nextProps.processingInvites && (!nextProps.processingInvites)) {
      this.props.onDeleteInvite(null)
    }
  }

  onJoinConfirm() {
    const { onJoinConfirm } = this.props
    // call without argument, so the role would be detected automatically
    onJoinConfirm()
  }

  render() {
    const {
      currentUser, members, deletingMember, isAddingTeamMember, onMemberDeleteConfirm, onMemberDelete, isShowJoin,
      showNewMemberConfirmation, onJoin, onShowProjectDialog, isShowProjectDialog,
      projectTeamInvites, onProjectInviteDeleteConfirm, onProjectInviteSend, deletingInvite, changeRole,
      onDeleteInvite, isShowTopcoderDialog, onShowTopcoderDialog, processingInvites, processingMembers,
      onTopcoderInviteSend, onTopcoderInviteDeleteConfirm, topcoderTeamInvites, onAcceptOrRefuse, error,
      onSelectedMembersUpdate, selectedMembers, allMembers, updatingMemberIds, onShowCopilotDialog, copilotTeamInvites,
      isShowCopilotDialog, onCopilotInviteSend,
    } = this.props

    const {
      projectTeamInviteButtonExpanded,
      topcoderTeamInviteButtonExpanded,
      copilotTeamInviteButtonExpanded,
    } = this.state
    const currentMember = members.filter((member) => member.userId === currentUser.userId)[0]
    const modalActive = isAddingTeamMember || deletingMember || isShowJoin || showNewMemberConfirmation || deletingInvite

    const customerTeamManageAction = hasPermission(PERMISSIONS.MANAGE_CUSTOMER_TEAM)
    const topcoderTeamManageAction = hasPermission(PERMISSIONS.MANAGE_TOPCODER_TEAM)
    const copilotTeamManageAction = hasPermission(PERMISSIONS.MANAGE_COPILOTS)
    const copilotRemoveAction = hasPermission(PERMISSIONS.REMOVE_COPILOTS)
    const copilotViewAction = hasPermission(PERMISSIONS.VIEW_COPILOTS)
    const canRequestCopilot = hasPermission(PERMISSIONS.REQUEST_COPILOTS)
    const canJoinTopcoderTeam = !currentMember && hasPermission(PERMISSIONS.JOIN_TOPCODER_TEAM)

    const sortedMembers = members
    let projectTeamInviteCount = 0
    let topcoderTeamInviteCount = 0
    let copilotTeamInviteCount = 0

    return (
      <div className="team-management-container">
        <div className="projects-team">
          <div className="title">
            <span styleName="title-text">Team</span>
            {!customerTeamManageAction &&
              <span className="title-action" onClick={() => onShowProjectDialog(true)}>
                View
              </span>
            }
          </div>
          <div className="members">
            {sortedMembers.map((member, i) => {
              if (!hasPermission(PERMISSIONS.BE_LISTED_IN_CUSTOMER_TEAM, { user: member })) {
                return
              }
              projectTeamInviteCount++
              if(!projectTeamInviteButtonExpanded && projectTeamInviteCount > 3) {
                return null
              }
              return (
                <MemberItem
                  usr={member}
                  id={i}
                  key={i}
                  previewAvatar
                  size={40}
                />
              )
            })}
            {projectTeamInvites.map((invite, i) => {
              // const member = invite.email ? { email: invite.email } : invite.member
              projectTeamInviteCount++
              if(!projectTeamInviteButtonExpanded && projectTeamInviteCount > 3) {
                return null
              }
              return (
                <MemberItem
                  usr={invite}
                  id={i}
                  key={i}
                  previewAvatar
                  size={40}
                  invitedLabel
                  showEmailOnly={!invite.userId}
                />
              )
            })}
            {projectTeamInviteCount >3 &&
                <div styleName="button-container">
                  <div className="join-btn" onClick={this.projectTeamInviteButtonClick}>
                    {!projectTeamInviteButtonExpanded ?'Show All': 'Show Less'}
                  </div>
                </div>
            }
            {customerTeamManageAction &&
                <div styleName="button-container">
                  <div className="join-btn" onClick={() => onShowProjectDialog(true)}>
                    <AddIcon />
                    <div>
                    Manage Invitations
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>

        <hr styleName="separator" />
        <div className="projects-team">
          <div className="title">
            <span styleName="title-text">Copilot</span>
            {(copilotTeamManageAction || copilotRemoveAction || copilotViewAction) &&
              <span className="title-action" onClick={() => onShowCopilotDialog(true)}>
                {(copilotTeamManageAction || copilotRemoveAction) ? 'Manage' : 'View'}
              </span>
            }
          </div>
          <div className="members">
            {sortedMembers.map((member, i) => {
              if (!hasPermission(PERMISSIONS.BE_LISTED_IN_COPILOT_TEAM, { user: member })) {
                return
              }

              copilotTeamInviteCount++
              if (!copilotTeamInviteButtonExpanded && copilotTeamInviteCount > 3) {
                return null
              }

              return (
                <MemberItem usr={member} id={i} key={i} previewAvatar size={40}/>
              )
            })}
            {copilotTeamInvites.map((invite, i) => {
              copilotTeamInviteCount++
              if(!copilotTeamInviteButtonExpanded && copilotTeamInviteCount > 3) {
                return null
              }

              return (
                <MemberItem key={i}
                  usr={invite}
                  id={i}
                  previewAvatar
                  size={40}
                  invitedLabel
                />
              )
            })}
            {copilotTeamInviteCount > 3 &&
              <div styleName="button-container">
                <div className="join-btn" onClick={this.copilotTeamInviteButtonClick}>
                  {!copilotTeamInviteButtonExpanded ? 'Show All': 'Show Less'}
                </div>
              </div>
            }
            {canRequestCopilot &&
              <div styleName="button-container">
                <a
                  className="join-btn"
                  href="https://topcoder.typeform.com/to/YJ7AL4p8#handle=xxxxx&projectid=xxxxx" target="_blank"
                >
                  Request Copilot
                </a>
              </div>
            }
          </div>
        </div>

        <hr styleName="separator" />
        <div className="projects-team">
          <div className="title">
            <span styleName="title-text">Topcoder</span>
            <span className="title-action" onClick={() => onShowTopcoderDialog(true)}>
              {topcoderTeamManageAction ? 'Manage' : 'View'}
            </span>
          </div>
          <div className="members">
            {sortedMembers.map((member, i) => {
              if (!hasPermission(PERMISSIONS.BE_LISTED_IN_TOPCODER_TEAM, { user: member })) {
                return
              }

              topcoderTeamInviteCount++
              if(!topcoderTeamInviteButtonExpanded &&topcoderTeamInviteCount > 3) {
                return null
              }

              return (
                <MemberItem usr={member} id={i} key={i} previewAvatar size={40}/>
              )
            })}
            {topcoderTeamInvites.map((invite, i) => {
              topcoderTeamInviteCount++
              if(!topcoderTeamInviteButtonExpanded &&topcoderTeamInviteCount > 3) {
                return null
              }

              return (
                <MemberItem key={i}
                  usr={invite}
                  id={i}
                  previewAvatar
                  size={40}
                  invitedLabel
                />
              )
            })}
            {topcoderTeamInviteCount >3 &&
              <div styleName="button-container">
                <div className="join-btn" onClick={this.topcoderTeamInviteButtonClick}>
                  {!topcoderTeamInviteButtonExpanded ?'Show All': 'Show Less'}
                </div>
              </div>
            }
            {canJoinTopcoderTeam &&
              <div styleName="button-container">
                <div className="join-btn" onClick={() => onJoin(true)}>
                  <AddIcon />
                  <div>
                    Join project
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        {isShowJoin && ((() => {
          const onClickCancel = () => onJoin(false)
          return (
            <Dialog
              isLoading={processingMembers}
              onCancel={onClickCancel}
              onConfirm={this.onJoinConfirm}
              title="Join project as Manager"
              loadingTitle="Adding you to the project...."
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
              error={error}
              currentUser={currentUser}
              members={members}
              allMembers={allMembers}
              isMember={!!currentMember}
              onCancel={onClickCancel}
              removeMember={removeMember}
              projectTeamInvites={projectTeamInvites}
              topcoderTeamInvites={topcoderTeamInvites}
              sendInvite={onProjectInviteSend}
              removeInvite={removeInvite}
              onSelectedMembersUpdate={onSelectedMembersUpdate}
              selectedMembers={selectedMembers}
              processingInvites={processingInvites}
            />
          )
        })())}
        {(!modalActive && isShowCopilotDialog) && ((() => {
          const onClickCancel = () => onShowCopilotDialog(false)
          const removeMember = (member) => {
            onMemberDelete(member)
          }
          const removeInvite = (item) => {
            onDeleteInvite({item, type: 'copilot'})
          }
          return (
            <CopilotDialog
              processingInvites={processingInvites}
              error={error}
              currentUser={currentUser}
              members={members}
              allMembers={allMembers}
              isMember={!!currentMember}
              onCancel={onClickCancel}
              removeMember={removeMember}
              projectTeamInvites={projectTeamInvites}
              topcoderTeamInvites={topcoderTeamInvites}
              copilotTeamInvites={copilotTeamInvites}
              sendInvite={onCopilotInviteSend}
              removeInvite={removeInvite}
              onSelectedMembersUpdate={onSelectedMembersUpdate}
              selectedMembers={selectedMembers}
              processingInvites={processingInvites}
            />
          )
        })())}
        {(!modalActive && (isShowTopcoderDialog || this.props.history.location.hash === '#manageTopcoderTeam')) && ((() => {
          const onClickCancel = () => {
            this.props.history.push(this.props.history.location.pathname)
            onShowTopcoderDialog(false)
          }
          const removeMember = (member) => {
            onMemberDelete(member)
          }
          const removeInvite = (item) => {
            onDeleteInvite({item, type: 'topcoder'})
          }
          return (
            <TopcoderDialog
              processingInvites={processingInvites}
              updatingMemberIds={updatingMemberIds}
              error={error}
              currentUser={currentUser}
              members={members}
              allMembers={allMembers}
              isMember={!!currentMember}
              onCancel={onClickCancel}
              removeMember={removeMember}
              sendInvite={onTopcoderInviteSend}
              approveOrDecline={onAcceptOrRefuse}
              projectTeamInvites={projectTeamInvites}
              topcoderTeamInvites={topcoderTeamInvites}
              removeInvite={removeInvite}
              changeRole={changeRole}
              onSelectedMembersUpdate={onSelectedMembersUpdate}
              selectedMembers={selectedMembers}
              processingInvites={processingInvites}
            />
          )
        })())}
        {deletingMember && ((() => {
          const onClickCancel = () => onMemberDelete(null)
          const onClickConfirm = () => {
            onMemberDeleteConfirm(deletingMember)
          }
          const userFullName = getFullNameWithFallback(deletingMember)
          const isCurrentUser = (currentUser.userId === deletingMember.userId)
          const title = isCurrentUser ? LEAVE_TITLE : REMOVE_TITLE
          const content = isCurrentUser ? LEAVE_MESSAGE : REMOVE_USER_MESSAGE.replace('USERNAME', userFullName)
          const buttonText = isCurrentUser ? 'Leave project' : 'Remove member'
          const loadingTitle = isCurrentUser ? 'Removing you from the project...' : 'Removing member from the project...'
          return (
            <Dialog
              isLoading={processingMembers}
              onCancel={onClickCancel}
              onConfirm={onClickConfirm}
              title={title}
              loadingTitle={loadingTitle}
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
              onProjectInviteDeleteConfirm(deletingInvite)
            } else {
              onTopcoderInviteDeleteConfirm(deletingInvite)
            }
          }
          const identifier = deletingInvite.item.email ? deletingInvite.item.email : deletingInvite.item.handle
          return (
            <Dialog
              isLoading={processingInvites}
              onCancel={onClickCancel}
              onConfirm={onClickConfirm}
              title={REMOVE_INVITATION_TITLE}
              loadingTitle="Deleting invite...."
              content={REMOVE_INVITE_MESSAGE.replace('USEREMAIL', identifier)}
              buttonText="Remove invitation"
              buttonColor="red"
            />
          )
        })())}
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
  }).isRequired,

  /**
   * The list of all project members
   */
  members: PropTypes.arrayOf(userShape).isRequired,

  /**
   * The list of all members which data is loaded client side at the moment
   */
  allMembers: PropTypes.arrayOf(PropTypes.object).isRequired,

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
   * Callback fired when selected members are updated
   */
  onSelectedMembersUpdate: PropTypes.func,

  /**
   * List of members added to auto complete input
   */
  selectedMembers: PropTypes.arrayOf(PropTypes.object),

  /**
   * Callback to accept or refuse invite
   */
  onAcceptOrRefuse: PropTypes.func,

  /**
   * Callback to send member role
   */
  changeRole: PropTypes.func,

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
   * List of member ids being updated
   */
  updatingMemberIds: PropTypes.arrayOf(PropTypes.number).isRequired,

  /**
   * Flag indicates if invite API is running
   */
  processingInvites: PropTypes.bool.isRequired,

  /**
   * The current error
   */
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
}

export default uncontrollable(TeamManagement, {
  deletingMember: 'onMemberDelete',
  isShowJoin: 'onJoin',
  isShowProjectDialog: 'onShowProjectDialog',
  isShowCopilotDialog: 'onShowCopilotDialog',
  isShowTopcoderDialog: 'onShowTopcoderDialog',
  deletingInvite: 'onDeleteInvite',
  isInvited: 'onInviteAcceptShow'
})
