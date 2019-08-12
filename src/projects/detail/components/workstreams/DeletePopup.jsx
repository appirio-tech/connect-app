/**
 * Component with the button to delete item
 */
import React from 'react'
import PT from 'prop-types'
import Modal from 'react-modal'

import './DeletePopup.scss'

const DeletePopup = ({
  onDeleteClick,
  onCancelClick,
  header,
  body,
  deleteButton
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
      {header}
    </div>

    <div className="modal-body">
      {body}
    </div>

    <div className="button-area flex center action-area">
      <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={onCancelClick}>Cancel</button>
      <button className="tc-btn tc-btn-warning tc-btn-sm action-btn " onClick={onDeleteClick}>{deleteButton}</button>
    </div>
  </Modal>
)

DeletePopup.defaultProps = {
  deleteButton: 'Delete',
  header: 'WARNING!',
}

DeletePopup.propTypes = {
  onDeleteClick: PT.func.isRequired,
  onCancelClick: PT.func.isRequired,
  body: PT.string.isRequired,
  header: PT.string,
  deleteButton: PT.string
}

export default DeletePopup
