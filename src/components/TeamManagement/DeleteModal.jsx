import React from 'react'
import PropTypes from 'prop-types'

const DeleteModal = ({onCancel, onConfirm, isCustomer, isCopilot, isManager, isLeave}) => {
  let title
  let content
  let btnText

  const removeTmpl = (name) =>
    `The ${name} will lose all rights to the project and can’t see or interact with it anymore. ` +
    `Do you still want to remove the ${name}`

  if (isCustomer) {
    title = 'You are about to remove a member'
    content = removeTmpl('customer')
    btnText = 'Remove member'
  }

  if (isCopilot) {
    title = 'You are about to remove a copilot'
    content = removeTmpl('copilot')
    btnText = 'Remove copilot'
  }

  if (isManager) {
    title = 'You are about to remove a manager'
    content = removeTmpl('manager')
    btnText = 'Remove manager'
  }

  if (isLeave) {
    title = 'You are about to leave the project'
    content = 'Once you leave, somebody on the team has to add you for you to be able to see the project. Do you still want to leave the project?'
    btnText = 'Leave Project'
  }

  return (
    <div className="modal">
      <div className="modal-title danger">
        {title}
      </div>
      <div className="modal-body">
        <p className="message">
          {content}
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={onConfirm}>{btnText}</button>
        </div>
      </div>
    </div>
  )
}

DeleteModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isCustomer: PropTypes.bool,
  isCopilot: PropTypes.bool,
  isManager: PropTypes.bool,
  isLeave: PropTypes.bool
}

export default DeleteModal
