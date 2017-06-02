import React, { PropTypes as PT } from 'react'
import config from '../../../config/projectWizard'
import ProjectTypeCard from './ProjectTypeCard'
// import WizardHeader from './WizardHeader'
import SVGIconImage from '../../../components/SVGIconImage'
import './SelectProjectType.scss'

function SelectProjectType(props) {
  const cards = []
  for (const key in config) {
    const item = config[key]
    const icon = <SVGIconImage filePath={item.icon} />
    cards.push(
      <ProjectTypeCard
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
      <h1>Select your project category</h1>
      {cards}
      <div className="footer">
        Looking for something else? <a href="http://crowdsourcing.topcoder.com/piqued_by_crowdsourcing">Get in touch with us.</a>
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
