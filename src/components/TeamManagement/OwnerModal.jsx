import React, {PropTypes} from 'react'

const OwnerModal = ({member, onCancel, onConfirm}) => {
  return (
    <div className="modal">
      <div className="modal-title">
        You are about to assign a new project owner
      </div>
      <div className="modal-body">
        <p className="message">
          <strong>{member.firstName} {member.lastName}</strong> will become responsible for the project and be able to add and remove team members. Are you sure you want to proceed?
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={onConfirm}>Assign as owner</button>
        </div>
      </div>
    </div>
  )
}

OwnerModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired
}

export default OwnerModal
