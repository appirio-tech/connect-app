import React from 'react'
import Modal from 'react-modal'
import PT from 'prop-types'
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator'

const Dialog = ({onCancel, title, content, buttonColor, buttonText, isLoading, loadingTitle, onConfirm}) => (
  <Modal
    isOpen
    className="management-dialog"
    overlayClassName="management-dialog-overlay"
    shouldCloseOnOverlayClick={false}
    shouldCloseOnEsc={false}
    contentLabel=""
  >
    <div className="management-dialog-container">
      <div className="dialog-title">{isLoading ? loadingTitle : title}</div>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <div className="dialog-content" dangerouslySetInnerHTML={{__html: content}}/>
        </div>
      )}
      <div className="dialog-actions">
        <button
          onClick={onCancel}
          className="tc-btn tc-btn-default"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={'tc-btn tc-btn-primary tc-btn-md ' + (buttonColor !== 'blue' ? 'btn-red' : '')}
          disabled={isLoading}
        >
          {buttonText}
        </button>
      </div>
    </div>
  </Modal>
)

Dialog.defaultProps = {
  isLoading: false,
}

Dialog.propTypes = {
  onCancel: PT.func,
  onConfirm: PT.func,
  title: PT.string,
  content: PT.string,
  buttonColor: PT.string,
  buttonText: PT.string,
  isLoading: PT.bool,
}

export default Dialog
