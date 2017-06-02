import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import config from '../../../config/projectWizard'
import ProjectSubTypeCard from './ProjectSubTypeCard'
// import WizardHeader from './WizardHeader'
import SVGIconImage from '../../../components/SVGIconImage'
import './SelectProjectSubType.scss'

function SelectProjectSubType(props) {
  const cards = []
  const subConfig = config[_.findKey(config, {id : props.projectType})]
  for (const key in subConfig.subtypes) {
    const item = subConfig.subtypes[key]
    const icon = <SVGIconImage filePath={item.icon} />
    cards.push(
      <ProjectSubTypeCard
        icon={icon}
        info={item.brief}
        key={key}
        onClick={() => props.onSubCategoryChange(item.id)}
        selected={props.projectSubType === item.id}
        type={key}
      />
    )
  }

  const projectSubTypeKey = _.findKey(subConfig, {id : props.projectSubType})
  const details = projectSubTypeKey ?
    subConfig.subtypes[projectSubTypeKey].details :
    'Select your project type'
  return (
    <div className="SelectProjectSubType">
      <h1>{subConfig.question}</h1>
      {cards}
      <div className="details">{details}</div>
      <div
        className={`button ${props.projectSubType
          && props.projectType ? '' : 'disabled'}`}
        onClick={props.projectSubType && props.projectType ? props.createProject : _.noop}
      >
        Let's Start
      </div>
    </div>
  )
}

SelectProjectSubType.defaultProps = {
}

SelectProjectSubType.propTypes = {
  createProject: PT.func.isRequired,
  onProjectNameChange: PT.func.isRequired,
  onProjectRefChange: PT.func.isRequired,
  onSubCategoryChange: PT.func.isRequired,
  projectName: PT.string.isRequired,
  projectRef: PT.string.isRequired,
  projectSubType: PT.string.isRequired,
  projectType: PT.string.isRequired
}

export default SelectProjectSubType
