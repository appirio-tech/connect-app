import React from 'react'
import PT from 'prop-types'

import ProjectTypeCard from './ProjectTypeCard'
import { getProjectTemplatesByCategory } from '../../../helpers/templates'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'

import { DOMAIN } from '../../../config/constants'

import './SelectProjectType.scss'

const SelectProjectType = ({
  onProjectTypeChange,
  projectTypes,
  projectTemplates,
}) => {
  const cards = []

  projectTypes.forEach((projectType) => {
    // don't render disabled items for selection
    // don't render hidden items as well, hidden items can be reached via direct link though
    if (projectType.disabled || projectType.hidden) return

    const visibleProjectTemplates = getProjectTemplatesByCategory(projectTemplates, projectType.key, true)

    const icon = <ProjectTypeIcon type={projectType.icon} />

    cards.push(
      <ProjectTypeCard
        icon={icon}
        info={projectType.info}
        key={projectType.key}
        onClick={() => onProjectTypeChange(projectType.key)}
        type={projectType.displayName}
        buttonText={visibleProjectTemplates.length > 1 ? 'View All' : 'Select Project'}
      />
    )
  })

  return (
    <div>
      <div className="SelectProjectType">
        <h1>Create a new project</h1>
        <div className="cards">{cards}</div>
        <div className="footer">
        Looking for something else? <a href={`https://${DOMAIN}/contact?utm_source=Connect&utm_medium=Referral&utm_campaign=FooterContact`}>Get in touch with us &rarr;</a>
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
