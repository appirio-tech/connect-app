import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getAvatarResized } from '../../helpers/tcHelpers'

class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userText: '',
      validUserText: false,
      managerType: {},
      clearText: false,
    }

    this.onUserRoleChange = this.onUserRoleChange.bind(this)
    this.onInviteChange = this.onInviteChange.bind(this)
    this.addUsers = this.addUsers.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.clearText && nextProps.processingInvites !== this.props.processingInvites &&
      !nextProps.processingInvites) {
      this.setState({
        userText: '',
        validUserText: false,
        clearText: false,
      })
    }
  }

  onUserRoleChange(memberId, type) {
    const managerType = Object.assign({}, this.state.managerType)
    managerType[memberId] = type
    this.setState({managerType})
  }

  onInviteChange(evt) {
    const text = evt.target.value
    const users = text.split(/[,;]/g)
    const isInvalid = users.some(user => {
      user = user.trim()
      if (user === '') {
        return false
      }
      return !(/(.+)@(.+){2,}\.(.+){2,}/.test(user) || (user.startsWith('@')) && user.length > 1)
    })
    this.setState({
      validUserText: !isInvalid && text.trim().length > 0,
      userText: evt.target.value
    })
  }

  addUsers() {
    let users = this.state.userText.split(/[,;]/g)
    users = users.map(user => user.trim())
    this.props.addUsers(users)
    this.setState({clearText: true})
  }

  render() {
    const {members, currentUser, isMember, removeMember, onCancel, removeInvite, invites = []} = this.props
    const showRemove = (isMember && currentUser.isManager)
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
                    if (!isMember || member.isCopilot || (!currentUser.isAdmin && member.isManager && member.userId !== currentUser.userId)) {
                      return (
                        <div className="member-type-wrapper">
                          <div className={`member-type ${member.isManager && 'member-type-blue'}`}>
                            {member.isManager ? 'Manager' : 'Copilot'}
                          </div>
                        </div>
                      )
                    }
                    const types = ['Observer', 'BDR', 'Manager']
                    const currentType = this.state.managerType[member.userId] || 'Manager'
                    const onClick = (type) => {
                      this.onUserRoleChange(member.userId, type)
                    }
                    return (
                      <div className="member-role-container">
                        {types.map((type, i) =>
                          (
                            <div key={i} onClick={onClick.bind(this, type)}
                              className={`member-role ${(type === currentType) ? 'active' : ''}`}
                            >
                              {type}
                            </div>
                          )
                        )}
                      </div>
                    )
                  })()}
                </div>
              )
            }))}
            {(invites.map((invite) => {
              const remove = () => {
                removeInvite(invite.item)
              }
              const username = invite.item.startsWith('@') ? invite.item.substring(1) : invite.item
              i++
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i%2 !== 0) ? 'dark' : ''}`}
                >
                  <Avatar
                    userName={username}
                    size={40}
                  />
                  <div className="member-name member-email">
                    <span>
                      {invite.item}
                    </span>
                    <span className="email-date">
                      Invited {moment(invite.time).format('MMM D, YY')}
                    </span>
                  </div>
                  {showRemove && <div className="member-remove" onClick={remove}>
                    Remove
                    <span className="email-date">
                      Invited {moment(invite.time).format('MMM D, YY')}
                    </span>
                  </div>}
                </div>
              )
            }))}
          </div>

          {showRemove && <div className="input-container">
            <div className="hint">invite more people</div>
            <input
              type="text"
              value={this.state.userText}
              onInput={this.onInviteChange}
              placeholder="Enter one or more users email or @handle separated by ';' or comma ','"
              className="tc-file-field__inputs"
              disabled={!isMember || this.state.clearText}
            />
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              onClick={this.addUsers}
              disabled={!this.state.validUserText || this.state.clearText}
            >
              Send Invite
            </button>
          </div>}

          {!showRemove && <div className="dialog-placeholder" />}
        </div>
      </Modal>
    )
  }
}

Dialog.propTypes = {
  processingInvites: PT.bool.isRequired,
  currentUser: PT.object.isRequired,
  members: PT.arrayOf(PT.object).isRequired,
  isMember: PT.bool.isRequired,
  onCancel: PT.func.isRequired,
  removeMember: PT.func.isRequired,
  invites: PT.arrayOf(PT.object),
  addUsers: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
}

export default Dialog
