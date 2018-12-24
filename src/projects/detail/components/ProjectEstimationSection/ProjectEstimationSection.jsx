/**
 * Project estimations
 *
 * This components should display project estimation values for all types of projects
 *
 * NOTE This component has been created during refactoring of the old code and hasn't beed really tested.
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { getProductEstimate } from '../../../../config/projectWizard'

import './ProjectEstimationSection.scss'

const numberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const ProjectEstimationSection = ({ project, templates }) => {
  let projectTemplate = null
  if (project.version === 'v2') {
    const { products } = project.details
    const productId = products ? products[0] : null
    console.log(productId)
    // TODO find template id
  } else {
    const templateId = project.templateId
    projectTemplate = _.find(templates, t => t.id === templateId)
  }
  console.log('Rendering ProjectEstimationSection')
  console.log(project)
  if (!projectTemplate) {
    return null
  }
  const { priceEstimate, durationEstimate } = getProductEstimate(projectTemplate, project)

  return (
    <div className="list-group">
      <div className="project-estimation-section">
        <h4 className="titles gray-font">Project Estimate</h4>
        <h3 className="label">Duration:</h3>
        <h3 className="estimate">{durationEstimate}</h3>
        <h3 className="label">Quick Quote:</h3>
        <h3 className="estimate"><span>$</span> { numberWithCommas(priceEstimate) }</h3>
      </div>
    </div>
  )
}

ProjectEstimationSection.propTypes = {
  project: PropTypes.object.isRequired,
  templates: PropTypes.array.isRequired,
}

export default ProjectEstimationSection
