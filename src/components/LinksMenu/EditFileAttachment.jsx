import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import UserAutoComplete from '../UserAutoComplete/UserAutoComplete'

export class EditFileAttachment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title : props.attachment.title,
      allowedUsers: props.attachment.allowedUsers
    }
    this.onUserIdChange = this.onUserIdChange.bind(this)
    this.handlesToUserIds = this.handlesToUserIds.bind(this)
    this.userIdsToHandles = this.userIdsToHandles.bind(this)
  }

  handleTitleChange(event) {
    this.setState({title: event.target.value})
  }

  userIdsToHandles(allowedUsers) {
    const { projectMembers } = this.props
    allowedUsers = allowedUsers || []
    return allowedUsers.map(userId => _.get(projectMembers[userId], 'handle'))
  }

  handlesToUserIds(handles) {
    const { projectMembers } = this.props
    const projectMembersByHandle = _.mapKeys(projectMembers, value => value.handle)
    handles = handles || []
    return handles.filter(handle => handle).map(handle => _.get(projectMembersByHandle[handle], 'userId'))
  }

  onUserIdChange(selectedHandles = '') {
    this.setState({
      allowedUsers: this.handlesToUserIds(selectedHandles.split(','))
    })
  }

  render() {
    const { onCancel, onConfirm, projectMembers, loggedInUser } = this.props
    const { title, allowedUsers } = this.state
    return (
      <div className="modal delete-link-modal">
        <div className="modal-title danger">
        You're about to edit an attachment
        </div>
        <div className="modal-body">
          <label for="title">Title:</label>
          <input className="edit-input" type="text" value={title} onChange={this.handleTitleChange.bind(this)} name="title"/> 
          <br />
          <UserAutoComplete onUpdate={this.onUserIdChange} 
            projectMembers={projectMembers}
            loggedInUser={loggedInUser}
            selectedUsers={this.userIdsToHandles(allowedUsers).join(',')}
          />
          <br />

          <div className="button-area flex center">
            <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
            <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={() => onConfirm(title, allowedUsers)}>Edit Attachment</button>
          </div>
        </div>
      </div>
    )}
}

EditFileAttachment.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
  // link: PropTypes.object.isRequired
}

export default EditFileAttachment
