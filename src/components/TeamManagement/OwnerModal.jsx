import React, {PropTypes} from 'react'

const OwnerModal = ({member, onCancel, onConfirm}) => {
  return (
    <div className="modal">
      <div className="modal-title center">
        Assign member as owner
      </div>
      <div className="modal-body">
        <p className="message center">
          This will make <strong>{member.name}</strong> the project owner. Do you still want to proceed?
        </p>

        <div className="button-area">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          {' '}
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
