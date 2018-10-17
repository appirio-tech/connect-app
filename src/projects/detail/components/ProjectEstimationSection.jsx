/**
 * Shows project estimations based on project type.
 * 
 * For now it only supports `Visual Desgin` project type.
 * 
 * NOTE This component has been created during refactoring of the old code and hasn't beed really tested.
 */
import React from 'react'
import PT from 'prop-types'

import VisualDesignProjectEstimateSection from './VisualDesignProjectEstimateSection'

const ProjectEstimationSection = ({ project }) => {
  const { products } = project.details

  return (
    <div className="list-group">
      <VisualDesignProjectEstimateSection products={products} project={project} />
    </div>
  )
}

ProjectEstimationSection.propTypes = {
  project: PT.object.isRequired,
}

export default ProjectEstimationSection