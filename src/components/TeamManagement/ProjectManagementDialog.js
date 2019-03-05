import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import {getAvatarResized} from '../../helpers/tcHelpers'
import AutocompleteInput from './AutocompleteInput'

class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clearText: false,
      showAlreadyMemberError: false,
      invitedMembers: {},
      members: {},
      errorMessage: null
    }
    this.onChange = this.onChange.bind(this)
    this.onErrorMessage = this.onErrorMessage.bind(this)
  }

  componentWillMount() {
    this.setState({
      invitedMembers: this.props.invites,
      members: this.props.members
    })
  }

  componentWillReceiveProps(nextProps) {
    const {processingInvites} = this.props
    if (processingInvites && !nextProps.processingInvites && nextProps.error ) {
      this.onErrorMessage(nextProps.error, this.props.selectedMembers)
    }
  }

  onChange(selectedMembers) {
    // If a member invited with email exists in selectedMembers
    let present = _.some(this.state.invitedMembers, invited => _.findIndex(selectedMembers,
      selectedMember => selectedMember.isEmail && selectedMember.handle === invited.email) > -1)
    // If a member invited with handle exists in selectedMembers
    present = present || _.some(this.state.invitedMembers, invited => {
      if (!invited.member) {
        return false
      }
      return _.findIndex(selectedMembers,
        selectedMember => !selectedMember.isEmail && selectedMember.handle === invited.member.handle) > -1
    })
    // If members exist in selectedMembers
    present = present || _.some(this.state.members, m => _.findIndex(selectedMembers,
      selectedMember => selectedMember.handle === m.handle) > -1)
    this.setState({
      validInviteText: !present,
      showAlreadyMemberError: present
    })
    this.props.onSelectedMembersUpdate(selectedMembers)
  }

  onErrorMessage(error, selectedMembers) {
    if(error.msg) {
      this.setState({
        errorMessage: error.msg
      })
      return
    }
    const msg = []
    _.forEach(error.failed, (failed) => {
      const existingMessage = _.find(msg, (m) => failed.message === m.message)
      if(existingMessage) {
        existingMessage.allUsers.push((failed.email ? failed.email: _.find(selectedMembers, (m) => m.userId === failed.id).handle))
        const index = _.find(msg, (m) => failed.message === m.message)
        msg.splice(index, 1, existingMessage)
      } else {
        msg.push({
          message: failed.message,
          allUsers: [ (failed.email ? failed.email: _.find(selectedMembers, (m) => m.userId === failed.id).handle) ]
        })
      }
    })
    const listMessages = _.map(msg, m => `${m.allUsers} : ${m.message}`)
    this.setState({
      errorMessage: _.join(listMessages, '\n')
    })
  }

  render() {
    const {
      members, currentUser, isMember, removeMember, removeInvite,
      onCancel, invites = [], selectedMembers, processingInvites
    } = this.props
    const showRemove = currentUser.isAdmin || (!currentUser.isCopilot && isMember)
    const allMembers = [...members, ...invites.map(i => i.member)]
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
            Customer team
            <span onClick={onCancel}><XMarkIcon/></span>
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
                  className={`project-member-layout ${(i % 2 !== 0) ? 'dark' : ''}`}
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
              const handle = invite.member ? invite.member.handle : null
              const firstName = _.get(invite.member, 'firstName', '')
              const lastName = _.get(invite.member, 'lastName', '')
              let userFullName = `${firstName} ${lastName}`
              userFullName = userFullName.trim().length > 0 ? userFullName : null
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i % 2 !== 0) ? 'dark' : ''}`}
                >
                  <Avatar
                    userName={invite.email || userFullName}
                    avatarUrl={invite.email ? '' : getAvatarResized(_.get(invite.member || {}, 'photoURL'), 40)}
                    size={40}
                  />
                  <div className="member-name">
                    {!invite.email && <span className="span-name">{userFullName}</span>}
                    <span>
                      {!invite.email && <span className="member-handle">@{handle}</span>}
                      {invite.email && <span className="member-email">{invite.email}</span>}
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

          <div className="input-container">
            <div className="hint">invite more people</div>
            <AutocompleteInput
              placeholder="Enter one or more emails or user handles"
              onUpdate={this.onChange}
              currentUser={currentUser}
              selectedMembers={selectedMembers}
              disabled={processingInvites || (!currentUser.isAdmin && !isMember)}
              allMembers={allMembers}
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
              disabled={processingInvites || !this.state.validInviteText || this.state.clearText}
              onClick={this.props.sendInvite}
            >
              Send Invite
            </button>
          </div>
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
  invites: PT.arrayOf(PT.object),
  sendInvite: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
  onSelectedMembersUpdate: PT.func.isRequired,
  selectedMembers: PT.arrayOf(PT.object),
  processingInvites: PT.bool.isRequired,
}

export default Dialog
