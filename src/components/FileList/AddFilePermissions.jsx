import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { mapKeys, get } from 'lodash'

import UserAutoComplete from '../UserAutoComplete/UserAutoComplete'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'

import './AddFilePermissions.scss'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'

const AddFilePermission = ({ onCancel, onSubmit, onChange, selectedUsers, projectMembers, loggedInUser, isSharingAttachment }) => {
  selectedUsers = selectedUsers || ''
  const mapHandlesToUserIds = handles => {
    const projectMembersByHandle = mapKeys(projectMembers, value => value.handle)
    return handles.filter(handle => handle).map(h => get(projectMembersByHandle[h], 'userId'))
  }

  return (
    <Modal
      isOpen
      className="project-dialog-conatiner"
      overlayClassName="management-dialog-overlay"
      contentLabel=""
    >
      <div className="project-dialog">
        <div className="dialog-title">
          Who do you want to share this file with?
          <span onClick={onCancel}><XMarkIcon /></span>
        </div>

        <div styleName="loading-indicator-wrapper">
          { isSharingAttachment && <LoadingIndicator isSmall /> }
        </div>

        {/* Share with all members */}
        <div className="dialog-body">
          <div styleName="btn-all-members">
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              onClick={() => onSubmit(null)}
              disabled={isSharingAttachment}
            >All project members</button>
          </div>
        </div>

        {/* Share with specific people */}
        <div className="input-container">
          <div className="hint">OR ONLY SPECIFIC PEOPLE</div>

          <UserAutoComplete
            projectMembers={projectMembers}
            selectedUsers={selectedUsers ? selectedUsers.split(',').map((handle) => ({ value: handle, label: handle })) : []}
            onUpdate={onChange}
            loggedInUser={loggedInUser}
          />

          <div styleName="btn-selected-members">
            <button className="tc-btn tc-btn-primary tc-btn-md"
              onClick={() => onSubmit(mapHandlesToUserIds(selectedUsers.split(',')))}
              disabled={!selectedUsers || selectedUsers.length === 0 || isSharingAttachment }
            >Share with selected members</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

AddFilePermission.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedUsers: PropTypes.string,
  projectMembers: PropTypes.object,
  loggedInUser: PropTypes.object.isRequired,
  isSharingAttachment: PropTypes.bool.isRequired,
}

export default AddFilePermission
