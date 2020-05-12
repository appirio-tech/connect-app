import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { mapKeys, get } from 'lodash'

import UserAutoComplete from '../UserAutoComplete/UserAutoComplete'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'

import './AddFilePermissions.scss'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import { TagSelect } from '../TagSelect/TagSelect'

const AddFilePermission = ({ onCancel, onSubmit, onChange, selectedUsers, selectedTags, projectMembers, loggedInUser, isSharingAttachment }) => {
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
          Attachment Options
          <span onClick={onCancel}><XMarkIcon /></span>
        </div>

        <div styleName="loading-indicator-wrapper">
          { isSharingAttachment && <LoadingIndicator isSmall /> }
        </div>

        <div className="dialog-body">
          {/* Tags */}
          <div styleName="dialog-sub-title">
            Tags (optional)
          </div>
          <TagSelect
            selectedTags={selectedTags}
            onUpdate={tags => onChange(selectedUsers, tags)}
          />

          {/* Permissions */}
          <div styleName="dialog-sub-title">
            Who do you want to share this file with?
          </div>

          {/* Share with all members */}
          <div styleName="btn-all-members">
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              onClick={() => onSubmit(null, selectedTags)}
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
            onUpdate={users => onChange(users, selectedTags)}
            loggedInUser={loggedInUser}
          />

          <div styleName="btn-selected-members">
            <button className="tc-btn tc-btn-primary tc-btn-md"
              onClick={() => onSubmit(mapHandlesToUserIds(selectedUsers.split(',')), selectedTags)}
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
