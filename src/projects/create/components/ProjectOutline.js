import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import config from '../../../config/projectWizard'
import ProjectSubTypeCard from './ProjectSubTypeCard'
import WizardHeader from './WizardHeader'
import SVGIconImage from '../../../components/SVGIconImage'
import VisualDesignProjectEstimateSection from '../../detail/components/VisualDesignProjectEstimateSection'
import './ProjectOutline.scss'

function ProjectOutline({ project }) {
  const product = _.get(project, 'details.products[0]')
  const projectTypeId = _.get(project, 'type')
  if (!projectTypeId || !product) return <div></div>
  const projectType = _.findKey(config, {id : projectTypeId})
  const subConfig = config[projectType]
  const productName = _.findKey(subConfig.subtypes, {id : product})
  const projectSize = 'To be estimated'
  return (
    <div className="ProjectOutline">
      <h5>Project Outline</h5>
      <div className="project-name">{ project.name }</div>
      <div className="project-product">{ productName }</div>
      <ul className="project-meta-data">
        <li className="project-meta-data-row">
          <span className="project-meta-data-label">Type:</span>
          <span className="project-meta-data-value">{ projectType }</span>
        </li>
        <li className="project-meta-data-row">
          <span className="project-meta-data-label">Size:</span>
          <span className="project-meta-data-value">{ projectSize }</span>
        </li>
        <li className="project-meta-data-row">
          <span className="project-meta-data-label">Work:</span>
          <span className="project-meta-data-value">{ productName }</span>
        </li>
        <div className="project-description">{ project.description }</div>
        <li><hr /></li>
        <li className="project-meta-data-row">
          <VisualDesignProjectEstimateSection
            products={ _.get(project, 'details.products', []) }
            numberScreens={ _.get(project, 'details.appDefinition.numberScreens', '') }
          />
        </li>
      </ul>
    </div>
  )
}

ProjectOutline.defaultProps = {
}

ProjectOutline.propTypes = {
}

export default ProjectOutline
