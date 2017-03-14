import React, { PropTypes } from 'react'
import './VisualDesignProjectEstimateSection.scss'
import typeToSpecification from '../../../config/projectSpecification/typeToSpecification'
import _ from 'lodash'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const DEFAULT_DESIGN_TEMPLATE = 'visual_design.v1.0'

const VisualDesignProjectEstimateSection = ({products, numberScreens}) => {
  // determine the spec template to use for the first product used in the project
  // TODO when we support multiple products per project, we can loop through products and sum up the estimates
  const specTemplate = products.length > 0 ? typeToSpecification[products[0]] : DEFAULT_DESIGN_TEMPLATE
  const sections = require('../../../config/projectQuestions/' + specTemplate).default
  // appDefinition section
  const section = _.find(sections, (section) => section.id === 'appDefinition')
  const { subSections } = section
  // questions sub section
  const sectionQuestions = _.find(subSections, (subSection) => subSection.id === 'questions').questions

  // options provided in the number of screens question
  const { options: projectDurationOptions } = _.find(
    sectionQuestions,
    (question) => question.fieldName === 'details.appDefinition.numberScreens'
  )
  // selected option
  const pickedDurationOption = _.find(projectDurationOptions, (option) => option.value === numberScreens)
  const durationEstimate = pickedDurationOption ? pickedDurationOption.desc : '0 days'
  const priceEstimate = pickedDurationOption && pickedDurationOption.price ? pickedDurationOption.price : 0

  return (
    <div className="visual-design-project-estimate-section">
      <h4 className="titles gray-font">Project Estimate</h4>
      <h3 className="label">Duration</h3>
      <h3 className="estimate">{durationEstimate}</h3>
      <h3 className="label">Quick Quote</h3>
      <h3 className="estimate"><span>$</span> { numberWithCommas(priceEstimate) }</h3>
    </div>
  )
}

VisualDesignProjectEstimateSection.propTypes = {
  numberScreens: PropTypes.string
}

export default VisualDesignProjectEstimateSection
