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
import AutocompleteInput from './AutocompleteInput'

class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userRole: 'manager',
      userText: '',
      validUserText: false,
      managerType: {},
      clearText: false,
      members: {},
      showAlreadyMemberError: false
    }

    this.onUserRoleChange = this.onUserRoleChange.bind(this)
    this.handleRoles = this.handleRoles.bind(this)
    this.addUsers = this.addUsers.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount(){
    const { currentUser } = this.props

    this.roles = [{
      title: 'Manager',
      value: 'manager',
    }, {
      title: 'Observer',
      value: 'observer',
    }, {
      title: 'Copilot',
      value: 'copilot',
      disabled: !(currentUser.isCopilotManager || currentUser.isAdmin),
      toolTipMessage: !(currentUser.isCopilotManager || currentUser.isAdmin) ? 'Only Connect Copilot Managers can invite copilots.' : null,
    }]
    this.setState({
      members: this.props.members
    })
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
    // If a member invited with email exists in selectedMembers
    let present = _.some(this.props.invites, invited => _.findIndex(selectedMembers,
      selectedMember => selectedMember.isEmail && selectedMember.handle === invited.email) > -1)
    // If a member invited with handle exists in selectedMembers
    present = present || _.some(this.props.invites, invited => {
      if (!invited.member) {
        return false
      }
      return _.findIndex(selectedMembers,
        selectedMember => !selectedMember.isEmail && selectedMember.handle === invited.member.handle) > -1
    })
    present = present || _.some(this.state.members, m => _.findIndex(selectedMembers,
      selectedMember => selectedMember.handle === m.handle) > -1)
    this.setState({
      validUserText: !present,
      showAlreadyMemberError: present,
    })
    this.props.onSelectedMembersUpdate(selectedMembers)
  }

  render() {
    const {
      members, currentUser, isMember, removeMember, onCancel, removeInvite, invites = [],
      selectedMembers, processingInvites
    } = this.props
    const showRemove = currentUser.isAdmin || (isMember && currentUser.isManager)
    let i = 0
    const allMembers = [...members, ...invites.map(i => i.member)]
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
              const role = _.find(this.roles, r => r.value === member.role).title
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
                    const types = ['Observer', 'Copilot', 'Manager']
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
            {(invites.map((invite) => {
              const remove = () => {
                removeInvite(invite)
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
                  {showRemove && <div className="member-remove" onClick={remove}>
                    Remove
                    <span className="email-date">
                      Invited {moment(invite.createdAt).format('MMM D, YY')}
                    </span>
                  </div>}
                </div>
              )
            }))}
          </div>

          {showRemove && <div className="input-container" >
            <div className="hint">invite more people</div>
            <AutocompleteInput
              onUpdate={this.onChange}
              currentUser={currentUser}
              selectedMembers={selectedMembers}
              disabled={processingInvites || (!currentUser.isAdmin && !isMember)}
              allMembers={allMembers}
            />
            { this.state.showAlreadyMemberError && <div className="error-message">
                Project Member(s) can't be invited again. Please remove them from list.
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
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              type="submit"
              disabled={processingInvites || !this.state.validUserText || this.state.clearText}
              onClick={this.addUsers}
            >
              Send Invite
            </button>
          </div>
          }
          {!showRemove && <div className="dialog-placeholder" />}
        </div>
      </Modal>
    )
  }
}

Dialog.defaultProps = {
  invites: [],
  members: []
}

Dialog.propTypes = {
  error: PT.oneOfType([PT.object, PT.bool]),
  currentUser: PT.object.isRequired,
  members: PT.arrayOf(PT.object).isRequired,
  isMember: PT.bool.isRequired,
  onCancel: PT.func.isRequired,
  removeMember: PT.func.isRequired,
  changeRole: PT.func.isRequired,
  invites: PT.arrayOf(PT.object),
  addUsers: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
  onSelectedMembersUpdate: PT.func.isRequired,
  selectedMembers: PT.arrayOf(PT.object),
  processingInvites: PT.bool.isRequired,
}

export default Dialog
