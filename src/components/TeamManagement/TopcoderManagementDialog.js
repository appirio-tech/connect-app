import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getAvatarResized, getFullNameWithFallback } from '../../helpers/tcHelpers'
import AutocompleteInputContainer from './AutocompleteInputContainer'
import {
  PROJECT_MEMBER_INVITE_STATUS_REQUESTED, PROJECT_MEMBER_INVITE_STATUS_PENDING,
  PROJECT_MEMBER_INVITE_STATUS_REQUEST_APPROVED, PROJECT_MEMBER_INVITE_STATUS_REQUEST_REJECTED,
} from '../../config/constants'
import PERMISSIONS from '../../config/permissions'
import {hasPermission} from '../../helpers/permissions'
import { compareEmail, compareHandles } from '../../helpers/utils'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'

class TopcoderManagementDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      managerType: {},
      showAlreadyMemberError: false,
      errorMessage: null,
      processingInviteRequestIds: [], // ids of invites for which request is being processed
    }

    this.onChange = this.onChange.bind(this)
    this.showIndividualErrors = this.showIndividualErrors.bind(this)
  }

  onChange(selectedMembers) {
    const { projectTeamInvites, members, topcoderTeamInvites, copilotTeamInvites } = this.props

    const present = _.some(selectedMembers, (selectedMember) => (
      this.isSelectedMemberAlreadyInvited(members, selectedMember)
      || this.isSelectedMemberAlreadyInvited(topcoderTeamInvites, selectedMember)
      || this.isSelectedMemberAlreadyInvited(projectTeamInvites, selectedMember)
      || this.isSelectedMemberAlreadyInvited(copilotTeamInvites, selectedMember)
    ))

    this.setState({
      showAlreadyMemberError: present,
      errorMessage: null,
    })

    this.props.onSelectedMembersUpdate(selectedMembers)
  }

  componentWillReceiveProps(nextProps) {
    const { processingInvites, selectedMembers } = this.props

    if (processingInvites && !nextProps.processingInvites ) {
      const notInvitedSelectedMembers = _.reject(selectedMembers, (selectedMember) => (
        this.isSelectedMemberAlreadyInvited(nextProps.topcoderTeamInvites, selectedMember)
      ))

      this.props.onSelectedMembersUpdate(notInvitedSelectedMembers)

      if (nextProps.error) {
        this.showIndividualErrors(nextProps.error, notInvitedSelectedMembers)
      }
    }
  }

  isSelectedMemberAlreadyInvited(topcoderTeamInvites = [], selectedMember) {
    return !!topcoderTeamInvites.find((invite) => (
      (invite.email && compareEmail(invite.email, selectedMember.label)) ||
      (invite.userId && compareHandles(invite.handle, selectedMember.label))
    ))
  }

  showIndividualErrors(error) {
    const uniqueMessages = _.groupBy(error.failed, 'message')

    const msgs = _.keys(uniqueMessages).map((message) => {
      const users = uniqueMessages[message].map((failed) => (
        failed.email ? failed.email : failed.handle
      ))

      return ({
        message,
        users,
      })
    })

    const listMessages = msgs.map((m) => `${m.users.join(', ')}: ${m.message}`)

    this.setState({
      errorMessage: listMessages.length > 0 ? listMessages.join('\n') : null
    })
  }

  render() {
    const {
      members, currentUser, isMember, removeMember, onCancel, removeInvite, approveOrDecline, topcoderTeamInvites = [],
      selectedMembers, processingInvites,
    } = this.props
    const { processingInviteRequestIds } = this.state
    const showRemove = hasPermission(PERMISSIONS.MANAGE_TOPCODER_TEAM)
    const showApproveDecline = currentUser.isAdmin || currentUser.isCopilotManager
    const showSuggestions = hasPermission(PERMISSIONS.SEE_MEMBER_SUGGESTIONS)
    let i = 0

    return (
      <Modal
        isOpen
        className="project-dialog-conatiner"
        overlayClassName="management-dialog-overlay"
        onRequestClose={onCancel}
        contentLabel=""
      >

        <div className="project-dialog">
          <div className="dialog-title">
            Topcoder team
            <span onClick={onCancel}><XMarkIcon /></span>
          </div>

          <div className="dialog-body">
            {(members.map((member) => {
              if (member.isCustomer || member.isCopilot) {
                return null
              }
              i++
              const remove = () => {
                removeMember(member)
              }
              const userFullName = getFullNameWithFallback(member)
              return (
                <div
                  key={i}
                  className={`project-member-layout ${i%2 === 1 ? 'dark' : ''}`}
                >
                  <div className="memer-details">
                    <Avatar
                      userName={userFullName}
                      avatarUrl={getAvatarResized(_.get(member, 'photoURL') || '', 80)}
                      size={40}
                    />
                    <div className="member-name">
                      <span className="span-name">{userFullName}</span>
                      <span className="member-handle">
                        @{member.handle || 'ConnectUser'}
                      </span>
                    </div>
                  </div>
                  {showRemove && <div className="member-remove" onClick={remove}>
                    {(currentUser.userId === member.userId) ? 'Leave' : 'Remove'}
                  </div>}
                  {!showRemove && (currentUser.userId === member.userId) &&
                    <div className="member-remove" onClick={remove}>
                      Leave
                    </div>
                  }
                </div>
              )
            }))}
            {(topcoderTeamInvites.map((invite) => {
              const remove = () => {
                removeInvite(invite)
              }
              const approve = () => {
                this.setState(prevState => ({ processingInviteRequestIds: [ ...prevState.processingInviteRequestIds, invite.id ] }))
                approveOrDecline({
                  id: invite.id,
                  status: PROJECT_MEMBER_INVITE_STATUS_REQUEST_APPROVED
                }).then(() => {
                  this.setState(prevState => ({ processingInviteRequestIds: _.xor(prevState.processingInviteRequestIds, [invite.id]) }))
                })
              }
              const decline = () => {
                this.setState(prevState => ({ processingInviteRequestIds: [ ...prevState.processingInviteRequestIds, invite.id ] }))
                approveOrDecline({
                  id: invite.id,
                  status: PROJECT_MEMBER_INVITE_STATUS_REQUEST_REJECTED
                }).then(() => {
                  this.setState(prevState => ({ processingInviteRequestIds: _.xor(prevState.processingInviteRequestIds, [invite.id]) }))
                })
              }
              const userFullName = getFullNameWithFallback(invite)
              i++
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i%2 !== 0) ? 'dark' : ''}`}
                >
                  <Avatar
                    userName={userFullName}
                    avatarUrl={getAvatarResized(_.get(invite, 'photoURL') || '', 80)}
                    size={40}
                  />
                  <div className="member-name">
                    <span className="span-name">{userFullName}</span>
                    <span className="member-handle">
                      @{invite.handle || 'ConnectUser'}
                    </span>
                  </div>

                  {
                    invite.status===PROJECT_MEMBER_INVITE_STATUS_REQUESTED && showApproveDecline &&
                    <div className="member-remove">
                      {!_.includes(processingInviteRequestIds, invite.id) ? ([
                        <span onClick={approve} key="approve">approve</span>,
                        <span onClick={decline} key="decline">decline</span>
                      ]) : (
                        <LoadingIndicator isSmall />
                      )}
                      <span className="email-date">
                        Requested {moment(invite.createdAt).format('MMM D, YY')}
                      </span>
                    </div>
                  }
                  {
                    invite.status===PROJECT_MEMBER_INVITE_STATUS_REQUESTED && !showApproveDecline && showRemove &&
                    <div className="member-remove">
                      <span className="email-date">
                        Requested {moment(invite.createdAt).format('MMM D, YY')}
                      </span>
                    </div>
                  }
                  {
                    invite.status===PROJECT_MEMBER_INVITE_STATUS_PENDING && showRemove &&
                    <div className="member-remove" onClick={remove}>
                      Remove
                      <span className="email-date">
                        Invited {moment(invite.createdAt).format('MMM D, YY')}
                      </span>
                    </div>
                  }
                  {
                    invite.status===PROJECT_MEMBER_INVITE_STATUS_PENDING && !showRemove &&
                    <div className="member-remove" >
                      <span className="email-date">
                        Invited {moment(invite.createdAt).format('MMM D, YY')}
                      </span>
                    </div>
                  }

                </div>
              )
            }))}
          </div>

          {(showRemove || showApproveDecline) && <div className="input-container" >
            <div className="hint">invite more people</div>
            <AutocompleteInputContainer
              placeholder="Enter one or more user handles"
              onUpdate={this.onChange}
              currentUser={currentUser}
              selectedMembers={selectedMembers}
              disabled={processingInvites || (!currentUser.isAdmin && !isMember && !currentUser.isCopilotManager)}
              showSuggestions={showSuggestions}
            />
            { this.state.showAlreadyMemberError && <div className="error-message">
              Project Member(s) can\'t be invited again. Please remove them from list.
            </div> }
            { this.state.errorMessage  && <div className="error-message">
              {this.state.errorMessage}
            </div> }
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              type="submit"
              disabled={processingInvites || this.state.showAlreadyMemberError || selectedMembers.length === 0}
              onClick={this.props.sendInvite}
            >
              Invite users
            </button>
          </div>
          }
          {!showRemove && <div className="dialog-placeholder" />}
        </div>
      </Modal>
    )
  }
}

TopcoderManagementDialog.defaultProps = {
  projectTeamInvites: [],
  topcoderTeamInvites: [],
  members: []
}

TopcoderManagementDialog.propTypes = {
  error: PT.oneOfType([PT.object, PT.bool]),
  currentUser: PT.object.isRequired,
  members: PT.arrayOf(PT.object).isRequired,
  allMembers: PT.arrayOf(PT.object).isRequired,
  isMember: PT.bool.isRequired,
  onCancel: PT.func.isRequired,
  removeMember: PT.func.isRequired,
  changeRole: PT.func.isRequired,
  projectTeamInvites: PT.arrayOf(PT.object),
  topcoderTeamInvites: PT.arrayOf(PT.object),
  sendInvite: PT.func.isRequired,
  approveOrDecline: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
  onSelectedMembersUpdate: PT.func.isRequired,
  selectedMembers: PT.arrayOf(PT.object),
  processingInvites: PT.bool.isRequired,
}

export default TopcoderManagementDialog
