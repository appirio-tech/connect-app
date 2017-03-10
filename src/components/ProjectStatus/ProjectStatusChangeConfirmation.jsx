import React, {PropTypes} from 'react'
import {SelectDropdown} from 'appirio-tech-react-components'
import { PROJECT_STATUS_COMPLETED, PROJECT_STATUS_CANCELLED } from '../../config/constants'

const ProjectStatusChangeConfirmation = ({ newStatus, onCancel, onConfirm, onReasonUpdate }) => {
  let confirmText
  let titleStatus
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
  const cancelReasons = [
    { value: 'spam', title: 'Spam'},
    { value: 'demo', title: 'Demo/Test'},
    { value: 'competitor', title: 'Went with competitor'},
    { value: 'price', title: 'Price/Cost'},
    { value: 'non-community', title: 'Not a good fit for community'},
    { value: 'by-choice', title: 'Declined by our choice'},
    { value: 'customer-inactivity', title: 'Customer didn\'t make decision'},
    { value: 'customer-inhouse', title: 'Customer decided to do it themselves'}
  ]
  return (
    <div className="modal project-status-change-modal">
      <div className="modal-title danger">
        You are about to { titleStatus } the project
      </div>
      <div className="modal-body">
        <p className="message">
          This will permanently change the status your project. This action cannot be undone.
        </p>

        { newStatus === PROJECT_STATUS_CANCELLED &&
          <div className="cancellation-reason">
            <label>Why do you cancel this project?</label>
            <div className="select-cancellation-reason">
              <SelectDropdown
                options={ cancelReasons }
                onSelect={ onReasonUpdate }
                theme="default"
              />
            </div>
          </div>
        }

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
