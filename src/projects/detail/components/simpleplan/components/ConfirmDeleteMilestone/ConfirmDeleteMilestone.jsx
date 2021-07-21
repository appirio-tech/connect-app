import React from 'react'
import PT from 'prop-types'
import IconHelp from '../../../../../../assets/icons/help-me.svg'

import './ConfirmDeleteMilestone.scss'

function ConfirmDeleteMilestone({ onClose }) {
  return (
    <div styleName="confirm-delete-milestone">
      <h3 styleName="title">
        <IconHelp styleName="icon" />
        Deletion Confirmation
      </h3>
      <p styleName="text">
        Are you sure you want to delete the selected Milestone (s)?
      </p>
      <div styleName="footer">
        <button type="button" className="tc-btn tc-btn-primary tc-btn-sm" onClick={() => onClose(true)}>YES</button>
        <button type="button" className="tc-btn tc-btn-warning tc-btn-sm" onClick={() => onClose()}>NO</button>
      </div>
    </div>
  )
}

ConfirmDeleteMilestone.propTypes = {
  onClose: PT.func,
}

export default ConfirmDeleteMilestone
