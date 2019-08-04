/**
 * Component with the button to delete milestone card
 */
import React from 'react'
import PT from 'prop-types'
import Modal from 'react-modal'

import './DeleteMilestone.scss'

const DeleteMilestone = ({
  onDeleteClick,
  onCancelClick,
}) => (
  <Modal
    isOpen
    styleName="container"
    className="delete-post-dialog"
    overlayClassName="delete-post-dialog-overlay"
    onRequestClose={ onCancelClick }
    contentLabel=""
  >

    <div className="modal-title">
    WARNING!
    </div>

    <div className="modal-body">
    Are you sure you want to delete this milestone?
    </div>

    <div className="button-area flex center action-area">
      <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={onCancelClick}>Cancel</button>
      <button className="tc-btn tc-btn-warning tc-btn-sm action-btn" onClick={onDeleteClick}>Delete Milestone</button>
    </div>
  </Modal>
)

DeleteMilestone.propTypes = {
  onDeleteClick: PT.func.isRequired,
  onCancelClick: PT.func.isRequired,
}

export default DeleteMilestone
