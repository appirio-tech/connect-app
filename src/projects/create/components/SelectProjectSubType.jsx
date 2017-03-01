import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import config from '../../../config/projectWizard'
import ProjectSubTypeCard from './ProjectSubTypeCard'
import WizardHeader from './WizardHeader'
import SVGIconImage from '../../../components/SVGIconImage'
import './SelectProjectSubType.scss'

function SelectProjectSubType(props) {
  const cards = []
  const subConfig = config[props.projectType]
  for (const key in subConfig.subtypes) {
    const item = subConfig.subtypes[key]
    const icon = <SVGIconImage filePath={item.icon} />
    cards.push(
      <ProjectSubTypeCard
        disabled={!props.projectName}
        icon={icon}
        info={item.brief}
        key={key}
        onClick={() => props.onSubCategoryChange(key)}
        selected={props.projectSubType === key}
        type={key}
      />
    )
  }
  const details = props.projectSubType ?
    subConfig.subtypes[props.projectSubType].details :
    'Select your project type'
  return (
    <div className="SelectProjectSubType">
      <WizardHeader
        onProjectNameChange={props.onProjectNameChange}
        onProjectRefChange={props.onProjectRefChange}
        projectName={props.projectName}
        projectRef={props.projectRef}
      />
      <h1>{subConfig.question}</h1>
      {cards}
      <div className="details">{details}</div>
      <div
        className={`button ${props.projectSubType
          && props.projectName
          && !props.creatingProject ? '' : 'disabled'}`}
        onClick={props.projectSubType
          && props.projectName
          && !props.creatingProject ? props.createProject : _.noop}
      >
        {props.creatingProject ? 'Creating ...' : 'Create project'}
      </div>
    </div>
  )
}

SelectProjectSubType.defaultProps = {
  creatingProject: false
}

SelectProjectSubType.propTypes = {
  createProject: PT.func.isRequired,
  creatingProject: PT.bool,
  onProjectNameChange: PT.func.isRequired,
  onProjectRefChange: PT.func.isRequired,
  onSubCategoryChange: PT.func.isRequired,
  projectName: PT.string.isRequired,
  projectRef: PT.string.isRequired,
  projectSubType: PT.string.isRequired,
  projectType: PT.string.isRequired
}

export default SelectProjectSubType
