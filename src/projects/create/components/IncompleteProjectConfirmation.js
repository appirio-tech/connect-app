import React, { PropTypes as PT } from 'react'
import SVGIconImage from '../../../components/SVGIconImage'
import './IncompleteProjectConfirmation.scss'

function IncompleteProjectConfirmation({ loadIncompleteProject, removeIncompleteProject }) {
  
  return (
    <div className="IncompleteProjectConfirmation">
      <div className="header">
        <SVGIconImage filePath="connect-logo-mono" />
      </div>
      <h3>Welcome back!</h3>
      <h5>You started a project with us recently.</h5>
      <p>Do you want to continue where you left off or create a new project?</p>
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
