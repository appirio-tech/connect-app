import React from 'react'
import PropTypes from 'prop-types'

const DeleteFileLinkModal = ({ onCancel, onConfirm}) => {
  return (
    <div className="modal delete-link-modal">
      <div className="modal-title danger">
        You're about to delete a File
      </div>
      <div className="modal-body">
        <p className="message">
          Your team might need this link, are you sure you want to delete it? This action can't be undone.
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={onConfirm}>Delete file</button>
        </div>
      </div>
    </div>
  )
}

DeleteFileLinkModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
  // link: PropTypes.object.isRequired
}

export default DeleteFileLinkModal
