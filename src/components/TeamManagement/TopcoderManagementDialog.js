import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getAvatarResized } from '../../helpers/tcHelpers'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields


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
    this.roles = [{
      title: 'Manager',
      value: 'manager',
    }, {
      title: 'Observer',
      value: 'observer',
    }, {
      title: 'Copilot',
      value: 'copilot',
    }]
    this.setState({
      members: this.props.members
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.clearText && nextProps.processingInvites !== this.props.processingInvites &&
      !nextProps.processingInvites) {
      this.setState({
        userText: '',
        validUserText: false,
        clearText: false,
        members: this.props.members
      })
    }
  }

  onUserRoleChange(memberId, id, type) {
    const managerType = Object.assign({}, this.state.managerType)
    managerType[memberId] = type
    this.props.changeRole(id, {role: this.roles.find((role) => role.title === type).value})
    this.setState({managerType})
  }

  handleRoles(value) {
    this.setState({
      userRole: value
    })
  }

  addUsers() {
    let handles = this.state.userText.split(/[,;]/g)
    handles = handles.map(handle => handle.trim())
    handles = handles.filter((handle) => (handle.startsWith('@') && handle.length > 1))
    handles = handles.map(handle => handle.replace(/^@/, ''))

    this.props.addUsers({
      handles,
      role: this.state.userRole
    })
    this.setState({clearText: true})
  }

  onChange(currentValues) {
    const text = currentValues.handlesText
    let handles = text.split(/[,;]/g)
    const isInvalid = handles.some(user => {
      user = user.trim()
      if (user === '') {
        return false
      }
      return !(user.startsWith('@') && user.length > 1)
    })
    const validText = !isInvalid && text.trim().length > 0
    handles = handles.filter((handle) => (handle.trim().startsWith('@') && handle.length > 1))
    handles = handles.map(handle => handle.trim().replace(/^@/, ''))
    const present = _.some(this.state.members, m => handles.indexOf(m.handle) > -1)
    this.setState({
      validUserText: !present && validText,
      showAlreadyMemberError: present,
      userText: text
    })
  }

  render() {
    const {members, currentUser, isMember, removeMember, onCancel, removeInvite, invites = []} = this.props
    const showRemove = currentUser.isAdmin || (isMember && currentUser.isManager)
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
                removeInvite(invite)
              }
              const username = invite.member ? invite.member.handle : invite.userId
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
                      {username}
                    </span>
                    <span className="email-date">
                      Invited {moment(invite.time).format('MMM D, YY')}
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

          {showRemove && <Formsy.Form className="input-container" onValidSubmit={this.addUsers} onChange={this.onChange} >
            <div className="hint">invite more people</div>
            <TCFormFields.TextInput
              name="handlesText"
              wrapperClass="inviteTextInput"
              type="text"
              value={this.state.userText}
              placeholder="Enter one or more user @handles separated by ';' or comma ','"
              disabled={!isMember || this.state.clearText}
            />
            { this.state.showAlreadyMemberError && <div className="error-message">
                Project Member(s) can't be invited again. Please remove them from list.
            </div> }
            <Dropdown className="role-drop-down default">
              <div className="dropdown-menu-header">
                {(() => {
                  return (<span className="tc-link">{this.roles.filter((role) => this.state.userRole === role.value)[0].title}</span>)
                })()}
              </div>
              <div className="dropdown-menu-list down-layer">
                <ul>
                  {
                    this.roles.map((item) => {
                      const activeClass = cn({
                        active: item.value === this.state.userRole
                      })

                      return (<li key={item.value} className={activeClass} onClick={() => this.handleRoles(item.value)}>
                        <a href="javascript:;">{item.title}</a>
                      </li>)
                    })
                  }
                </ul>
              </div>
            </Dropdown>
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              type="submit"
              disabled={!this.state.validUserText || this.state.clearText}
            >
              Send Invite
            </button>
          </Formsy.Form>
          }
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
  changeRole: PT.func.isRequired,
  invites: PT.arrayOf(PT.object),
  addUsers: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
}

export default Dialog
