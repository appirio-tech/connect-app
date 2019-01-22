import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getAvatarResized } from '../../helpers/tcHelpers'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields

class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inviteText: '',
      validInviteText: false,
      clearText: false,
      showAlreadyMemberError: false,
      invitedMembers: {},
      members: {}
    }
    this.onChange = this.onChange.bind(this)
    this.sendInvites = this.sendInvites.bind(this)
  }

  componentWillMount(){
    this.setState({
      invitedMembers: this.props.invites,
      members: this.props.members
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.clearText && nextProps.processingInvites !== this.props.processingInvites &&
      !nextProps.processingInvites) {
      this.setState({
        inviteText: nextProps.error ? undefined : '',
        validInviteText: false,
        clearText: false,
      })
    }
  }

  onChange(currentValues) {
    const text = currentValues.emails
    const invites = text.split(/[,;]/g)
    const isValid = invites.every(invite => {
      invite = invite.trim()
      return  invite.length > 1 && (/(.+)@(.+){2,}\.(.+){2,}/.test(invite) || invite.startsWith('@'))
    })
    let present = _.some(this.state.invitedMembers, invited => invites.indexOf(invited.email) > -1)
    present = present || _.some(this.state.members, member => invites.indexOf(member.email) > -1)
    this.setState({
      validInviteText: !present && isValid && text.trim().length > 0,
      inviteText: currentValues.emails,
      showAlreadyMemberError: present
    })
  }

  // SEND INVITES
  sendInvites() {
    let invites = this.state.inviteText.split(/[,;]/g)
    invites = invites.map(invite => invite.trim())
    //emails = emails.filter((email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email))
    let handles = invites.filter((invite) => (invite.startsWith('@') && invite.length > 1))
    handles = handles.map(handle => handle.replace(/^@/, ''))
    const emails = invites.filter((invite) => (!invite.startsWith('@') && invite.length > 1))

    this.props.sendInvite(emails, handles)
    this.setState({clearText: true})
  }

  render() {
    const {members, currentUser, isMember, removeMember, removeInvite,
      onCancel, invites = []} = this.props
    const showRemove = currentUser.isAdmin || (!currentUser.isCopilot && isMember)
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
            Project team
            <span onClick={onCancel}><XMarkIcon /></span>
          </div>

          <div className="dialog-body">
            {(members.map((member) => {
              if (!member.isCustomer) {
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
                  className={`project-member-layout ${(i%2 !== 0) ? 'dark' : ''}`}
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
                </div>
              )
            }))}
            {(invites.map((invite) => {
              const remove = () => {
                removeInvite(invite)
              }
              i++
              const username = invite.member ? invite.member.handle : invite.userId
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i%2 !== 0) ? 'dark' : ''}`}
                >
                  <Avatar
                    userName={invite.email}
                    size={40}
                  />
                  <div className="member-name member-email">
                    <span>
                      {invite.email || username}
                    </span>
                    <span className="email-date">
                      Invited {moment(invite.createdAt).format('MMM D, YY')}
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

          <Formsy.Form className="input-container" onValidSubmit={this.sendInvites} onChange={this.onChange} >
            <div className="hint">invite more people</div>
            <TCFormFields.TextInput
              name="emails"
              wrapperClass="inviteTextInput"
              type="text"
              value={this.state.inviteText}
              placeholder="Enter one or more emails separated by ';' or comma ','"
              disabled={(!currentUser.isAdmin && !isMember) || this.state.clearText}
            />
            { this.state.showAlreadyMemberError && <div className="error-message">
                Project Member(s) can't be invited again. Please remove them from list.
            </div> }
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              type="submit"
              disabled={!this.state.validInviteText || this.state.clearText}
            >
              Send Invite
            </button>
          </Formsy.Form>
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
  sendInvite: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
}

export default Dialog
