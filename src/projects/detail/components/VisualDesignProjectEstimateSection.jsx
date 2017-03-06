import React, { PropTypes } from 'react'
import sections from '../../../config/projectQuestions/avd.v1.0'
import './VisualDesignProjectEstimateSection.scss'
import _ from 'lodash'

const section = _.find(sections, (section) => section.id === 'appDefinition')
const { pricePerPage, subSections } = section
const sectionQuestions = _.find(subSections, (subSection) => subSection.id === 'questions').questions
const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const { options: projectDurationOptions } = _.find(
  sectionQuestions,
  (question) => question.fieldName === 'details.appDefinition.numberScreens'
)

const VisualDesignProjectEstimateSection = ({numberScreens}) => {
  const priceEstimate = numberWithCommas((parseInt(numberScreens) || 0) * pricePerPage)
  const pickedDurationOption = _.find(projectDurationOptions, (option) => option.value === numberScreens)
  const durationEstimate = pickedDurationOption ? pickedDurationOption.desc : '0 days'

  return (
    <div className="visual-design-project-estimate-section">
      <h4 className="titles gray-font">Project Estimate</h4>
      <h3 className="label">Duration</h3>
      <h3 className="estimate">{durationEstimate}</h3>
      <h3 className="label">Quick Quote</h3>
      <h3 className="estimate">$ {priceEstimate}</h3>
    </div>
  )
}

VisualDesignProjectEstimateSection.propTypes = {
  numberScreens: PropTypes.string
}

export default VisualDesignProjectEstimateSection
