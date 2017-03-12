/**
 * This is the common header for both pages of the Create Project wizard.
 * It contains input fields to enter project name and optional reference.
 */

import React, { PropTypes as PT } from 'react'
import { PROJECT_NAME_MAX_LENGTH, PROJECT_REF_CODE_MAX_LENGTH } from '../../../config/constants'
import TextInput from '../../../components/TextInput'
import './WizardHeader.scss'

function WizardHeader(props) {
  return (
    <div className={`WizardHeader ${props.className}`}>
      <h1>Project name</h1>
      <TextInput
        className="project-name"
        maxLength={PROJECT_NAME_MAX_LENGTH}
        onChange={props.onProjectNameChange}
        placeholder="Enter project name here"
        value={props.projectName}
        autoFocus
      />
      <div className="project-ref-code-wrapper">
        <TextInput
          className="project-ref-code"
          maxLength={PROJECT_REF_CODE_MAX_LENGTH}
          onChange={props.onProjectRefChange}
          placeholder="REF code"
          value={props.projectRef}
        />
        Optional
      </div>
    </div>
  )
}

WizardHeader.propTypes = {
  onProjectNameChange: PT.func.isRequired,
  onProjectRefChange: PT.func.isRequired,
  projectName: PT.string.isRequired,
  projectRef: PT.string.isRequired
}

export default WizardHeader
