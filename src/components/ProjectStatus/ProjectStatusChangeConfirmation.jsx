import React, {PropTypes} from 'react'
import { PROJECT_STATUS_COMPLETED, PROJECT_STATUS_CANCELLED } from '../../config/constants'

const ProjectStatusChangeConfirmation = ({ newStatus, onCancel, onConfirm }) => {
  let confirmText, titleStatus
  switch(newStatus) {
  case PROJECT_STATUS_COMPLETED:
    confirmText = 'Close Project'
    titleStatus = 'close'
    break
  case PROJECT_STATUS_CANCELLED:
    confirmText = 'Cancel Project'
    titleStatus = 'cancel'
    break
  default:
    confirmText = 'Confirm'
    titleStatus = 'close'
  }
  return (
    <div className="modal project-status-change-modal">
      <div className="modal-title danger">
        You are about to { titleStatus } the project
      </div>
      <div className="modal-body">
        <p className="message">
          This will permanently change the status your project. This action cannot be undone.
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={onConfirm}>{ confirmText }</button>
        </div>
      </div>
    </div>
  )
}

ProjectStatusChangeConfirmation.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

export default ProjectStatusChangeConfirmation
