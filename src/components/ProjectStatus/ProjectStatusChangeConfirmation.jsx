import React, {PropTypes} from 'react'

const ProjectStatusChangeConfirmation = ({ onCancel, onConfirm }) => {

  return (
    <div className="modal project-status-change-modal">
      <div className="modal-title danger center">
        You are about to close the project
      </div>
      <div className="modal-body">
        <p className="message center">
          This will permanently change the status your project. This action cannot be undone.
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          {' '}
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={onConfirm}>Confirm</button>
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
