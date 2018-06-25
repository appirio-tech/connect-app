import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import VisualDesignProjectEstimateSection from '../../detail/components/VisualDesignProjectEstimateSection'
import ProjectCardHeader from '../../list/components/Projects/ProjectCardHeader'
import './ProjectOutline.scss'

function ProjectOutline({ project, projectTemplates }) {
  // TODO $PROJECT_PLAN$
  // comment getting estimation until I know where they have to come from
  // see https://github.com/appirio-tech/connect-app/issues/2016
  const product = _.get(project, 'details.products[0]')
  const projectTypeId = _.get(project, 'type')
  let projectEstimate = null
  if (!projectTypeId || !product) {
    projectEstimate = <div />
  }else {
    const projectTemplate = _.find(projectTemplates, {key: projectTypeId})
    const productName = projectTemplate.name
    const projectsWithEstimate = ['Wireframes', 'Visual Design', 'Front-end Prototype']
    if (projectsWithEstimate.indexOf(productName)>=0) {
      projectEstimate = (<li className="project-meta-data-row">
        <VisualDesignProjectEstimateSection
          products={ _.get(project, 'details.products', []) }
          project={ project }
        />
      </li>)
    } 
  }
  return (
    <div className="ProjectOutline">
      <h5>Project Outline</h5>
      <ProjectCardHeader project={project} projectTemplates={projectTemplates} />
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
  project: PT.object.isRequired,
  projectTemplates: PT.array.isRequired,
}

export default ProjectOutline
