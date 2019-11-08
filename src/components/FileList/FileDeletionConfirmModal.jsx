import React from 'react'
import PropTypes from 'prop-types'

const FileDeletionConfirmModal = ({ fileName, onCancel, onConfirm}) => {
  return (
    <div className="modal delete-file-modal">
      <div className="modal-title danger">
        You're about to delete the file '{fileName}'
      </div>
      <div className="modal-body">
        <p className="message">
          Are you sure you want to delete this file? You will not be able to undo this action.
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" type="button" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" type="button" onClick={onConfirm}>Delete File</button>
        </div>
      </div>
    </div>
  )
}

FileDeletionConfirmModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

export default FileDeletionConfirmModal
