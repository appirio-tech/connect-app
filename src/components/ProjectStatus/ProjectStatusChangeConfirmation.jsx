import React from 'react'
import PropTypes from 'prop-types'
import {SelectDropdown} from 'appirio-tech-react-components'
import uncontrollable from 'uncontrollable'
import { PROJECT_STATUS_COMPLETED, PROJECT_STATUS_CANCELLED } from '../../config/constants'

import './ProjectStatusChangeConfirmation.scss'

const ProjectStatusChangeConfirmation = ({
    newStatus,
    onCancel,
    onConfirm,
    onReasonUpdate,
    statusChangeReason,
    emptyCancelReason,
    showEmptyReasonError
  }) => {
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
    { value: null, title: '-- Select Reason --'},
    { value: 'spam', title: 'Spam'},
    { value: 'demo', title: 'Demo/Test'},
    { value: 'competitor', title: 'Customer selected competitor'},
    { value: 'price', title: 'Price too high'},
    { value: 'customer-inhouse', title: 'Being done in-house'},
    { value: 'customer-inactivity', title: 'Customer not responsive'},
    { value: 'non-community', title: 'Poor community fit'},
    { value: 'by-choice', title: 'Declined by us'}
  ]
  const handleReasonChange = (option) => {
    // after reason change, remove the error
    showEmptyReasonError(false)
    // update reason in parent component
    onReasonUpdate(option)
  }
  const handleConfirm = () => {
    // if new status is cancelled but cancel reason is not set, show error
    if (newStatus === PROJECT_STATUS_CANCELLED && !statusChangeReason) {
      showEmptyReasonError(true)
    } else { // otherwise update the status
      onConfirm()
    }
  }
  return (
    <div className="modal project-status-change-modal">
      <div className="modal-title danger">
        You are about to { titleStatus } the project
      </div>
      <div className="modal-body">
        <p className="message">
          This action will permanently change the status of your project and cannot be undone.
        </p>

        { newStatus === PROJECT_STATUS_CANCELLED &&
          <div className="cancellation-reason">
            <label>Why is this project being canceled?</label>
            <div className="select-cancellation-reason">
              <SelectDropdown
                options={ cancelReasons }
                onSelect={ handleReasonChange }
                theme="default"
                // support passing selected value for the dropdown
              />
            </div>
            { emptyCancelReason && <div className="tc-error-messages">Please select reason to cancel the project</div> }
          </div>
        }

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={ handleConfirm }>{ confirmText }</button>
        </div>
      </div>
    </div>
  )
}

ProjectStatusChangeConfirmation.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

export default uncontrollable(ProjectStatusChangeConfirmation, {
  emptyCancelReason: 'showEmptyReasonError'
})
