import React from 'react'
import PT from 'prop-types'

import SelectProjectTypeCard from './SelectProjectTypeCard'
import { getProjectTemplatesByCategory } from '../../../helpers/templates'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'
import IconArrowRight from '../../../assets/icons/arrows-16px-1_tail-right.svg'

import { DOMAIN } from '../../../config/constants'

import './SelectProjectType.scss'

const SelectProjectType = ({
  onProjectTypeChange,
  projectTypes,
  projectTemplates,
}) => {
  const cards = []

  projectTypes.forEach((projectType) => {

    const visibleProjectTemplates = getProjectTemplatesByCategory(projectTemplates, projectType.key, true)

    // don't render disabled items for selection
    // don't render hidden items as well, hidden items can be reached via direct link though
    if (projectType.disabled || projectType.hidden || visibleProjectTemplates.length === 0) return

    const icon = <ProjectTypeIcon type={projectType.icon} />

    cards.push(
      <SelectProjectTypeCard
        icon={icon}
        projectType={projectType}
        key={projectType.key}
        onClick={() => onProjectTypeChange(projectType.key, projectType)}
        buttonText={projectType.metadata.cardButtonText}
      />
    )
  })

  return (
    <div>
      <div className="SelectProjectType">
        <h1>Create a new project</h1>
        <div className="cards">{cards}</div>
        <div className="footer">
        Looking for something else? <a href={`https://${DOMAIN}/contact?utm_source=Connect&utm_medium=Referral&utm_campaign=FooterContact`}>Get in touch with us <IconArrowRight /></a>
        </div>
      </div>
    </div>
  )
}

SelectProjectType.propTypes = {
  onProjectTypeChange: PT.func.isRequired,
  projectTypes: PT.array.isRequired,
  projectTemplates: PT.array.isRequired,
}

export default SelectProjectType
