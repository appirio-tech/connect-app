import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { PERMISSIONS } from '../../config/permissions'

import { hasPermission } from '../../helpers/permissions'
import {getAvatarResized, getFullNameWithFallback} from '../../helpers/tcHelpers'
import { compareEmail, compareHandles } from '../../helpers/utils'
import AutocompleteInputContainer from './AutocompleteInputContainer'

class ProjectManagementDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAlreadyMemberError: false,
      errorMessage: null
    }
    this.onChange = this.onChange.bind(this)
    this.showIndividualErrors = this.showIndividualErrors.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { processingInvites, selectedMembers } = this.props

    if (processingInvites && !nextProps.processingInvites ) {
      const notInvitedSelectedMembers = _.reject(selectedMembers, (selectedMember) => (
        this.isSelectedMemberAlreadyInvited(nextProps.copilotTeamInvites, selectedMember)
      ))

      this.props.onSelectedMembersUpdate(notInvitedSelectedMembers)

      if (nextProps.error) {
        this.showIndividualErrors(nextProps.error, notInvitedSelectedMembers)
      }
    }
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
      validUserText: !present,
      showAlreadyMemberError: present,
      errorMessage: null,
    })

    this.props.onSelectedMembersUpdate(selectedMembers)
  }

  isSelectedMemberAlreadyInvited(copilotTeamInvites = [], selectedMember) {
    return !!copilotTeamInvites.find((invite) => (
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
      members, currentUser, removeMember, removeInvite,
      onCancel, copilotTeamInvites = [], selectedMembers, processingInvites,
    } = this.props
    const canManageCopilots = hasPermission(PERMISSIONS.MANAGE_COPILOTS)
    const canRemoveCopilots = hasPermission(PERMISSIONS.REMOVE_COPILOTS)
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
            Copilots
            <span onClick={onCancel}><XMarkIcon/></span>
          </div>

          <div className="dialog-body">
            {(members.map((member) => {
              if (!hasPermission(PERMISSIONS.BE_LISTED_IN_COPILOT_TEAM, { user: member })) {
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
                  className={`project-member-layout ${(i % 2 !== 0) ? 'dark' : ''}`}
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
                  {(canManageCopilots || canRemoveCopilots || (currentUser.userId === member.userId)) && <div className="member-remove" onClick={remove}>
                    {(currentUser.userId === member.userId) ? 'Leave' : 'Remove'}
                  </div>}
                </div>
              )
            }))}
            {(copilotTeamInvites.map((invite) => {
              const remove = () => {
                removeInvite(invite)
              }
              i++
              const hasUserId = !_.isNil(invite.userId)
              const handle = invite.handle
              const userFullName = getFullNameWithFallback(invite)
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i % 2 !== 0) ? 'dark' : ''}`}
                >
                  <Avatar
                    userName={hasUserId ? userFullName : invite.email}
                    avatarUrl={hasUserId ? getAvatarResized(_.get(invite, 'photoURL') || '', 80) : ''}
                    size={40}
                  />
                  <div className="member-name">
                    {hasUserId && <span className="span-name">{userFullName}</span>}
                    <span className="member-handle-container">
                      {hasUserId && handle && <span className="member-handle">@{handle}</span>}
                      { (!hasUserId) && <span className="member-email">{invite.email}</span>}
                    </span>
                  </div>
                  {(canManageCopilots || canRemoveCopilots) && <div className="member-remove" onClick={remove}>
                    Remove
                    <span className="email-date">
                      Invited {moment(invite.createdAt).format('MMM D, YY')}
                    </span>
                  </div>}
                </div>
              )
            }))}
            {i === 0 && !canManageCopilots && <div className="dialog-no-members" />}
          </div>

          {(canManageCopilots || canRemoveCopilots) && (
            <div className="input-container">
              <div className="hint">invite more copilots</div>
              <AutocompleteInputContainer
                placeholder="Enter one or more copilot handles"
                onUpdate={this.onChange}
                currentUser={currentUser}
                selectedMembers={selectedMembers}
                disabled={processingInvites}
                showSuggestions={showSuggestions}
              />
              {this.state.showAlreadyMemberError && <div className="error-message">
                Project Member(s) can't be invited again. Please remove them from list.
              </div>}
              { this.state.errorMessage  && <div className="error-message">
                {this.state.errorMessage}
              </div> }
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                type="submit"
                disabled={processingInvites || this.state.showAlreadyMemberError || selectedMembers.length === 0}
                onClick={this.props.sendInvite}
              >
                Send Invite
              </button>
            </div>
          )}
          {!canManageCopilots && <div className="dialog-placeholder" />}
        </div>

      </Modal>
    )
  }
}

ProjectManagementDialog.defaultProps = {
  projectTeamInvites: [],
  topcoderTeamInvites: [],
  members: []
}

ProjectManagementDialog.propTypes = {
  error: PT.oneOfType([PT.object, PT.bool]),
  currentUser: PT.object.isRequired,
  members: PT.arrayOf(PT.object).isRequired,
  allMembers: PT.arrayOf(PT.object).isRequired,
  isMember: PT.bool.isRequired,
  onCancel: PT.func.isRequired,
  removeMember: PT.func.isRequired,
  projectTeamInvites: PT.arrayOf(PT.object),
  topcoderTeamInvites: PT.arrayOf(PT.object),
  sendInvite: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
  onSelectedMembersUpdate: PT.func.isRequired,
  selectedMembers: PT.arrayOf(PT.object),
  processingInvites: PT.bool.isRequired,
}

export default ProjectManagementDialog
