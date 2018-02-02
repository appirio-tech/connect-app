import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import config from '../../../config/projectWizard'
import VisualDesignProjectEstimateSection from '../../detail/components/VisualDesignProjectEstimateSection'
import ProjectCardHeader from '../../list/components/Projects/ProjectCardHeader'
import './ProjectOutline.scss'

function ProjectOutline({ project }) {
  const product = _.get(project, 'details.products[0]')
  const projectTypeId = _.get(project, 'type')
  if (!projectTypeId || !product) return <div />
  const projectType = _.findKey(config, {id : projectTypeId})
  const subConfig = config[projectType]
  const productName = _.findKey(subConfig.subtypes, {id : product})
  const projectsWithEstimate = ['Wireframes', 'Visual Design', 'Front-end Prototype']
  const projectEstimate = (projectsWithEstimate.indexOf(productName)<0) ? (null) : (<li className="project-meta-data-row">
    <VisualDesignProjectEstimateSection
      products={ _.get(project, 'details.products', []) }
      numberScreens={ _.get(project, 'details.appDefinition.numberScreens', '') }
    />
  </li>)
  return (
    <div className="ProjectOutline">
      <h5>Project Outline</h5>
      <ProjectCardHeader project={project} />
      <div className="project-product">{ productName }</div>
      <ul className="project-meta-data">
        
        <div className="project-description">{ project.description }</div>
        <li><hr /></li>
        {projectEstimate}
      </ul>
    </div>
  )
}

ProjectOutline.defaultProps = {
}

ProjectOutline.propTypes = {
  project: PT.object.isRequired
}

export default ProjectOutline
