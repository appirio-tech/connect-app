import React from 'react'
import PT from 'prop-types'

import ProductCard from './ProductCard'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'
import { getProjectTypeByKey, getProjectTemplatesByCategory } from '../../../helpers/templates'

import { DOMAIN } from '../../../config/constants'

import './SelectProjectTemplate.scss'

const SelectProjectTemplate = ({
  onProjectTemplateChange,
  projectTemplates,
  projectTypeKey,
  projectTypes,
}) => {
  const projectType = getProjectTypeByKey(projectTypes, projectTypeKey)
  const visibleProjectTemplates = getProjectTemplatesByCategory(projectTemplates, projectTypeKey, true)
  const cards = []

  visibleProjectTemplates.forEach((projectTemplate) => {
    // don't render disabled items for selection
    // don't render hidden items as well, hidden items can be reached via direct link though
    if (projectTemplate.disabled || projectTemplate.hidden) return

    const icon = <ProjectTypeIcon type={projectTemplate.icon} />

    cards.push(
      <ProductCard
        icon={icon}
        info={projectTemplate.info}
        key={projectTemplate.id}
        onClick={() => onProjectTemplateChange(projectTemplate.key)}
        type={projectTemplate.name}
      />
    )
  })

  return (
    <div>
      <div className="header headerSelectProjectTemplate" />
      <div className="SelectProjectTemplate">
        <h1> { projectType.displayName } projects </h1>
        <h2>{ projectType.question }</h2>
        <div className="cards">{cards}</div>
        <div className="footer">
          Looking for something else? <a href={`https://${DOMAIN}/contact?utm_source=Connect&utm_medium=Referral&utm_campaign=FooterContact`}>Get in touch with us &rarr;</a>
        </div>
      </div>
    </div>
  )
}

SelectProjectTemplate.propTypes = {
  onProjectTemplateChange: PT.func.isRequired,
  projectTemplates: PT.array.isRequired,
  projectTypeKey: PT.string.isRequired,
  projectTypes: PT.array.isRequired,
}

export default SelectProjectTemplate
