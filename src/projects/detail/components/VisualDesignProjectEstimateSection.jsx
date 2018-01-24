import React from 'react'
import PropTypes from 'prop-types'
import './VisualDesignProjectEstimateSection.scss'
import typeToSpecification from '../../../config/projectSpecification/typeToSpecification'
import { getProductEstimate, findProduct } from '../../../config/projectWizard'
import _ from 'lodash'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const DEFAULT_DESIGN_TEMPLATE = 'visual_design.v1.0'

const VisualDesignProjectEstimateSection = ({products, project}) => {
  // TODO when we support multiple products per project, we can loop through products and sum up the estimates
  const productId = products[0]
  const product = findProduct(productId)
  if (!product || typeof product.basePriceEstimate === 'undefined') {
    return <div />
  }

  const { priceEstimate, durationEstimate} = getProductEstimate(productId, project)

  return (
    <div className="visual-design-project-estimate-section">
      <h4 className="titles gray-font">Project Estimate</h4>
      <h3 className="label">Duration:</h3>
      <h3 className="estimate">{durationEstimate}</h3>
      <h3 className="label">Quick Quote:</h3>
      <h3 className="estimate"><span>$</span> { numberWithCommas(priceEstimate) }</h3>
    </div>
  )
}

VisualDesignProjectEstimateSection.propTypes = {
  project: PropTypes.object.isRequired,
  products: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default VisualDesignProjectEstimateSection
