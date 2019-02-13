import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { mapKeys, get } from 'lodash'

import UserAutoComplete from '../UserAutoComplete/UserAutoComplete'

import './AddFilePermissions.scss'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'

const AddFilePermission = ({ onCancel, onSubmit, onChange, selectedUsers, projectMembers, loggedInUser }) => {
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

        {/* Share with all members */}
        <div className="dialog-body">
          <div styleName="btn-all-members">
            <button className="tc-btn tc-btn-primary tc-btn-md" onClick={() => onSubmit(null)}>All project members</button>
          </div>
        </div>
        
        {/* Share with specific people */}
        <div className="input-container">
          <div className="hint">OR ONLY SPECIFIC PEOPLE</div>

          <UserAutoComplete projectMembers={projectMembers} selectedUsers={selectedUsers} onUpdate={onChange} loggedInUser={loggedInUser} />

          <div>
            <button className="tc-btn tc-btn-primary tc-btn-md" 
              onClick={() => onSubmit(mapHandlesToUserIds(selectedUsers.split(',')))}
              disabled={!selectedUsers || selectedUsers.length === 0 }
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
  loggedInUser: PropTypes.object.isRequired
}

export default AddFilePermission
