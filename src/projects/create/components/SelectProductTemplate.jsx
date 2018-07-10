import React from 'react'
import PT from 'prop-types'

import ProjectTypeCard from './ProjectTypeCard'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'

import ConnectLogoMono from '../../../assets/icons/connect-logo-mono.svg'
import { DOMAIN } from '../../../config/constants'

import './SelectProductTemplate.scss'

const SelectProductTemplate = ({
  onProductTemplateChange,
  productTemplates,
}) => {
  const cards = []

  productTemplates.forEach((productTemplate) => {
    // don't render disabled items for selection
    // don't render hidden items as well, hidden items can be reached via direct link though
    if (productTemplate.disabled || productTemplate.hidden) return

    const icon = <ProjectTypeIcon type={productTemplate.icon} />

    cards.push(
      <ProjectTypeCard
        icon={icon}
        info={productTemplate.info || productTemplate.details}
        key={productTemplate.id}
        onClick={() => onProductTemplateChange(productTemplate.key || productTemplate.productKey)}
        type={productTemplate.name}
        buttonText="Select Product"
      />
    )
  })

  return (
    <div>
      <div className="header headerSelectProductTemplate">
        <ConnectLogoMono className="icon-connect-logo-mono"/>
      </div>
      <div className="SelectProductTemplate">
        <h1>Add A New Phase</h1>
        <div className="cards">{cards}</div>
      </div>
    </div>
  )
}

SelectProductTemplate.propTypes = {
  onProductTemplateChange: PT.func.isRequired,
  productTemplates: PT.array.isRequired,
}

export default SelectProductTemplate
