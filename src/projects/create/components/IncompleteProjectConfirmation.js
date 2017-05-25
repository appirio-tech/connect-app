import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import './IncompleteProjectConfirmation.scss'

function IncompleteProjectConfirmation({ loadIncompleteProject, removeIncompleteProject }) {
  
  return (
    <div className="IncompleteProjectConfirmation">
      <h3>Hello Victor G</h3>
      <h5>You created a project with us recently</h5>
      <h5>Do you want to continue where you left off, or create a new project?</h5>
      <div className="actions">
        <button className="tc-btn tc-btn-primary tc-btn-md" onClick={ loadIncompleteProject }>Continue where I left off</button>
        <button className="tc-btn tc-btn-default tc-btn-md" onClick={ removeIncompleteProject }>Create a new project</button>
      </div>
    </div>
  )
}

IncompleteProjectConfirmation.defaultProps = {
}

IncompleteProjectConfirmation.propTypes = {
  /**
   * Callback to be called when user selects to discard incomplete project and create new project
   */
  removeIncompleteProject: PT.func.isRequired,
  /**
   * Callback to be called when user selects to load incomplete project
   */
  loadIncompleteProject: PT.func.isRequired
}

export default IncompleteProjectConfirmation
