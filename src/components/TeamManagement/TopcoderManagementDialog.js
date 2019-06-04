import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getAvatarResized } from '../../helpers/tcHelpers'
import SelectDropdown from '../SelectDropdown/SelectDropdown'
import Tooltip from 'appirio-tech-react-components/components/Tooltip/Tooltip'
import AutocompleteInputContainer from './AutocompleteInputContainer'
import {PROJECT_MEMBER_INVITE_STATUS_REQUESTED, PROJECT_MEMBER_INVITE_STATUS_PENDING} from '../../config/constants'
import PERMISSIONS from '../../config/permissions'
import {checkPermission} from '../../helpers/permissions'
import { compareEmail, compareHandles } from '../../helpers/utils'

class TopcoderManagementDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userRole: 'manager',
      managerType: {},
      showAlreadyMemberError: false,
      errorMessage: null,
    }

    this.onUserRoleChange = this.onUserRoleChange.bind(this)
    this.handleRoles = this.handleRoles.bind(this)
    this.addUsers = this.addUsers.bind(this)
    this.onChange = this.onChange.bind(this)
    this.showIndividualErrors = this.showIndividualErrors.bind(this)

    this.roles = [{
      title: 'Manager',
      value: 'manager',
    }, {
      title: 'Observer',
      value: 'observer',
    }, {
      title: 'Copilot',
      value: 'copilot',
      canAddDirectly: true,
    }, {
      title: 'Account Manager',
      value: 'account_manager',
    }]
  }

  onUserRoleChange(memberId, id, type) {
    const managerType = Object.assign({}, this.state.managerType)
    managerType[memberId] = type
    this.props.changeRole(id, {role: this.roles.find((role) => role.title === type).value})
    this.setState({managerType})
  }

  handleRoles(option) {
    this.setState({
      userRole: option.value
    })
  }

  addUsers() {
    this.props.addUsers(this.state.userRole )
  }

  onChange(selectedMembers) {
    const { projectTeamInvites, members, topcoderTeamInvites } = this.props

    const present = _.some(selectedMembers, (selectedMember) => (
      this.isSelectedMemberAlreadyInvited(members, selectedMember)
      || this.isSelectedMemberAlreadyInvited(topcoderTeamInvites, selectedMember)
      || this.isSelectedMemberAlreadyInvited(projectTeamInvites, selectedMember)
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
      (invite.userId && compareHandles(this.resolveUserHandle(invite.userId), selectedMember.label))
    ))
  }

  /**
   * Get user handle using `allMembers` which comes from props and contains all the users
   * which are loaded to `members.members` in the Redux store
   *
   * @param {Number} userId user id
   */
  resolveUserHandle(userId) {
    const { allMembers } = this.props

    return _.get(_.find(allMembers, { userId }), 'handle')
  }

  showIndividualErrors(error) {
    const uniqueMessages = _.groupBy(error.failed, 'message')

    const msgs = _.keys(uniqueMessages).map((message) => {
      const users = uniqueMessages[message].map((failed) => (
        failed.email ? failed.email : this.resolveUserHandle(failed.userId)
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
    const showRemove = currentUser.isAdmin || (isMember && checkPermission(PERMISSIONS.INVITE_TOPCODER_MEMBER))
    const showApproveDecline = currentUser.isAdmin || currentUser.isCopilotManager
    let i = 0

    return (
      <Modal
        isOpen
        className="project-dialog-conatiner"
        overlayClassName="management-dialog-overlay"
        onRequestClose={onCancel}
        contentLabel=""
      >

        <div className="project-dialog topcoder-dialog">
          <div className="dialog-title">
            Topcoder team
            <span onClick={onCancel}><XMarkIcon /></span>
          </div>

          <div className="dialog-body">
            {(members.map((member) => {
              if (member.isCustomer) {
                return null
              }
              i++
              const remove = () => {
                removeMember(member)
              }
              const firstName = _.get(member, 'firstName', '')
              const lastName = _.get(member, 'lastName', '')
              let userFullName = `${firstName} ${lastName}`
              userFullName = userFullName.trim().length > 0 ? userFullName : 'Connect user'
              const role = _.get(_.find(this.roles, r => r.value === member.role), 'title')
              return (
                <div
                  key={i}
                  className={`project-member-layout ${i%2 === 1 ? 'dark' : ''}`}
                >
                  <div className="memer-details">
                    <Avatar
                      userName={userFullName}
                      avatarUrl={getAvatarResized(_.get(member, 'photoURL'), 40)}
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
                  {(() => {
                    if (!isMember || (!currentUser.isAdmin && !currentUser.isManager)) {
                      return (
                        <div className="member-type-wrapper">
                          <div className="member-type">
                            {role}
                          </div>
                        </div>
                      )
                    }
                    const types = ['Observer', 'Copilot', 'Manager', 'Account Manager']
                    const currentType = role
                    const onClick = (type) => {
                      this.onUserRoleChange(member.userId, member.id, type)
                    }
                    return (
                      <div className="member-role-container">
                        {types.map((type) => {
                          const isCopilotDisabled =
                            type === 'Copilot' &&
                            type !== currentType &&
                            !(currentUser.isCopilotManager || currentUser.isAdmin)

                          return (
                            isCopilotDisabled ? (
                              <Tooltip theme="light" key={type}>
                                <div className="tooltip-target">
                                  <div className="member-role disabled">
                                    {type}
                                  </div>
                                </div>
                                <div className="tooltip-body">
                                  {'Only Connect Copilot Managers can change member role to copilots.'}
                                </div>
                              </Tooltip>
                            ) : (
                              <div
                                key={type}
                                onClick={() => onClick(type)}
                                className={cn('member-role', { active: type === currentType })}
                              >
                                {type}
                              </div>
                            )
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              )
            }))}
            {(topcoderTeamInvites.map((invite) => {
              const remove = () => {
                removeInvite(invite)
              }
              const approve = () => {
                approveOrDecline({
                  userId: invite.userId,
                  status: 'request_approved'
                })
              }
              const decline = () => {
                approveOrDecline({
                  userId: invite.userId,
                  status: 'request_rejected'
                })
              }
              const firstName = _.get(invite.member, 'firstName', '')
              const lastName = _.get(invite.member, 'lastName', '')
              let userFullName = `${firstName} ${lastName}`
              userFullName = userFullName.trim().length > 0 ? userFullName : 'Connect user'
              i++
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i%2 !== 0) ? 'dark' : ''}`}
                >
                  <Avatar
                    userName={userFullName}
                    avatarUrl={getAvatarResized(_.get(invite.member, 'photoURL'), 40)}
                    size={40}
                  />
                  <div className="member-name">
                    <span className="span-name">{userFullName}</span>
                    <span className="member-handle">
                      @{invite.member.handle || 'ConnectUser'}
                    </span>
                  </div>

                  {
                    invite.status===PROJECT_MEMBER_INVITE_STATUS_REQUESTED && showApproveDecline &&
                    <div className="member-remove">
                      <span onClick={approve}>approve</span>
                      <span onClick={decline}>decline</span>
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
            />
            { this.state.showAlreadyMemberError && <div className="error-message">
              Project Member(s) can\'t be invited again. Please remove them from list.
            </div> }
            <Formsy.Form>
              <SelectDropdown
                name="role"
                value={this.state.userRole}
                theme="role-drop-down default"
                options={this.roles}
                onSelect={this.handleRoles}
              />
            </Formsy.Form>
            { this.state.errorMessage  && <div className="error-message">
              {this.state.errorMessage}
            </div> }
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              type="submit"
              disabled={processingInvites || this.state.showAlreadyMemberError || selectedMembers.length === 0}
              onClick={this.addUsers}
            >
              {_.find(this.roles, {value:this.state.userRole}).canAddDirectly && !showApproveDecline
                ?'Request invite'
                :'Invite users'}
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
  addUsers: PT.func.isRequired,
  approveOrDecline: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
  onSelectedMembersUpdate: PT.func.isRequired,
  selectedMembers: PT.arrayOf(PT.object),
  processingInvites: PT.bool.isRequired,
}

export default TopcoderManagementDialog
