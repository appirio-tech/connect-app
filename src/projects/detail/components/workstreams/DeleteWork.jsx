/**
 * Component with the button to delete work card
 */
import React from 'react'
import PT from 'prop-types'
import Modal from 'react-modal'

import './DeleteWork.scss'

const DeleteWork = ({
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
    Deleting a work can not be undone. If you proceed you will lose all data. Once a work is active, it can’t be deleted.
    </div>

    <div className="button-area flex center action-area">
      <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={onCancelClick}>Cancel</button>
      <button className="tc-btn tc-btn-warning tc-btn-sm action-btn " onClick={onDeleteClick}>Delete Work</button>
    </div>
  </Modal>
)

DeleteWork.propTypes = {
  onDeleteClick: PT.func.isRequired,
  onCancelClick: PT.func.isRequired,
}

export default DeleteWork
