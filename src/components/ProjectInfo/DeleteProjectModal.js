import React, {PropTypes} from 'react'

const DeleteProjectModal = ({ onCancel, onConfirm}) => {
  return (
    <div className="modal delete-project-modal">
      <div className="modal-title danger">
        You're about to delete this project
      </div>
      <div className="modal-body">
        <p className="message">
          Are you sure you want to delete this project? You will lose any information you have entered and will not be able to undo this action.
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={onConfirm}>Delete Project</button>
        </div>
      </div>
    </div>
  )
}

DeleteProjectModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
}

export default DeleteProjectModal
