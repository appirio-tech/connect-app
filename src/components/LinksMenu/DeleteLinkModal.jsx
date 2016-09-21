import React, {PropTypes} from 'react'

const DeleteLinkModal = ({ onCancel, onConfirm}) => {
  return (
    <div className="modal">
      <div className="modal-title danger flex center">
        You're about to delete a link
      </div>
      <div className="modal-body">
        <p className="message center">
          Your team might need this link, are you sure you want to delete it? This action can't be undone.
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          {' '}
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={onConfirm}>Delete link</button>
        </div>
      </div>
    </div>
  )
}

DeleteLinkModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
  // link: PropTypes.object.isRequired
}

export default DeleteLinkModal
