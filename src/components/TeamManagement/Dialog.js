import React from 'react'
import Modal from 'react-modal'
import PT from 'prop-types'

function Dialog({onCancel, onConfirm, title, content, buttonColor, buttonText, disabled}) {
  return (
    <Modal
      isOpen
      className="management-dialog"
      overlayClassName="management-dialog-overlay"
      onRequestClose={onCancel}
      shouldCloseOnOverlayClick={!disabled}
      shouldCloseOnEsc={!disabled}
      contentLabel=""
    >
      <div className="management-dialog-container">
        <div className="dialog-title">{title}</div>
        <div className="dialog-content" dangerouslySetInnerHTML={{__html: content}}/>
        <div className="dialog-actions">
          <button
            onClick={onCancel}
            className="tc-btn tc-btn-default"
            disabled={disabled}
          >
              Cancel
          </button>
          <button
            onClick={onConfirm}
            className={'tc-btn tc-btn-primary tc-btn-md ' + (buttonColor !== 'blue' ? 'btn-red' : '') }
            disabled={disabled}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

Dialog.propTypes = {
  onCancel: PT.func,
  onConfirm: PT.func,
  title: PT.string,
  content: PT.string,
  buttonColor: PT.string,
  buttonText: PT.string,
}

export default Dialog
