import React from 'react'
import PT from 'prop-types'

import ProjectTypeCard from './ProjectTypeCard'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'

import ConnectLogoMono from '../../../assets/icons/connect-logo-mono.svg'

import './SelectProductTemplate.scss'

const SelectProductTemplate = ({
  onProductTemplateChange,
  productTemplates,
  projectCategories,
}) => {
  const cards = {}
  const categoryNames = {}
  if (projectCategories) {
    projectCategories.forEach((category) => {
      categoryNames[category.key] = category.displayName
    })
  }

  productTemplates.forEach((productTemplate) => {
    // don't render disabled items for selection
    // don't render hidden items as well, hidden items can be reached via direct link though
    if (productTemplate.disabled || productTemplate.hidden) return

    const icon = <ProjectTypeIcon type={productTemplate.icon} />
    const category = productTemplate.category || ''
    cards[category] = cards[category] || []
    cards[category].push(
      <ProjectTypeCard
        icon={icon}
        info={productTemplate.info || productTemplate.details}
        key={productTemplate.id}
        onClick={() => onProductTemplateChange(productTemplate.key || productTemplate.productKey)}
        type={productTemplate.name}
        buttonText="Add phase to project"
      />
    )
  })
  const cardDivs = []
  Object.keys(cards).forEach((category) => {
    const card = cards[category]
    const catLabel = categoryNames[category] || category
    cardDivs.push(<div key={category}><div className="label">{catLabel}</div><div className="cards">{card}</div></div>)
  })
  return (
    <div>
      <div className="header headerSelectProductTemplate">
        <ConnectLogoMono className="icon-connect-logo-mono"/>
      </div>
      <div className="SelectProductTemplate">
        <h1>Add A New Phase</h1>
        {cardDivs}
      </div>
    </div>
  )
}

SelectProductTemplate.propTypes = {
  onProductTemplateChange: PT.func.isRequired,
  productTemplates: PT.array.isRequired,
  projectCategories: PT.array.isRequired,
}

export default SelectProductTemplate
