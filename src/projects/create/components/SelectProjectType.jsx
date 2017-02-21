import React, { PropTypes as PT } from 'react'
import config from '../../../config/projectWizard'
import ProjectTypeCard from './ProjectTypeCard'
import WizardHeader from './WizardHeader'
import './SelectProjectType.scss'

function SelectProjectType(props) {
  const cards = []
  for (const key in config) {
    const item = config[key]
    const icon = React.createElement(item.icon, {
      color: 'black',
      size: 60
    })
    cards.push(
      <ProjectTypeCard
        disabled={!props.projectName}
        icon={icon}
        info={item.info}
        key={key}
        onClick={() => props.onProjectTypeChange(key)}
        type={key}
      />
    )
  }
  return (
    <div className="SelectProjectType">
      <WizardHeader
        onProjectNameChange={props.onProjectNameChange}
        onProjectRefChange={props.onProjectRefChange}
        projectName={props.projectName}
        projectRef={props.projectRef}
      />
      <h1>Select your project category</h1>
      {cards}
      <div className="footer">
        Not what you're looking for? <a>Create an empty project</a> or <a>get in touch with us</a>
      </div>
    </div>
  )
}

SelectProjectType.propTypes = {
  onProjectNameChange: PT.func.isRequired,
  onProjectRefChange: PT.func.isRequired,
  onProjectTypeChange: PT.func.isRequired,
  projectName: PT.string.isRequired,
  projectRef: PT.string.isRequired
}

export default SelectProjectType
