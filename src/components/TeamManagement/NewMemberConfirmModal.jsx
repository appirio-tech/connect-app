import React from 'react'
import PropTypes from 'prop-types'

const NewMemberConfirmModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-title danger">
        You are about to change the owner
      </div>
      <div className="modal-body">
        <p className="message">
          You are adding a customer to the team which would make them owner. This can not be undone by you later.
        </p>
        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={onConfirm}>Add Owner</button>
        </div>
      </div>
    </div>
  )
}

NewMemberConfirmModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

export default NewMemberConfirmModal
