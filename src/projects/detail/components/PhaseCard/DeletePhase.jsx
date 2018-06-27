/**
 * Component with the button to delete phase card
 */
import React from 'react'

import './DeletePhase.scss'

const DeletePhase = ({
  onDeleteClick,
}) => (
  <div styleName="container">
    <div styleName="content">
      <p styleName="message">WARNING! Deleting a phase can not be undone. If you proceed you will lose all data. Once a phase is active, it can’t be deleted.</p>
      <div styleName="controls">
        <button
          className="tc-btn tc-btn-warning tc-btn-sm"
          onClick={onDeleteClick}
        >
          Delete phase
        </button>
      </div>
    </div>
  </div>
)

export default DeletePhase
