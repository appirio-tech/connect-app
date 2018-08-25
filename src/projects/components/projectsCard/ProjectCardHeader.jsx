import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import PT from 'prop-types'
import TextTruncate from 'react-text-truncate'
import { getProjectTemplateByKey } from '../../../helpers/templates'
import ProjectTypeIcon from '../../../components/ProjectTypeIcon'
import './ProjectCardHeader.scss'

function ProjectCardHeader({ project, onClick, projectTemplates }) {
  if (!project) return null

  const projectTemplateId = project.templateId
  const projectTemplateKey = _.get(project, 'details.products[0]')
  let projectTemplate = projectTemplateId
    ? _.find(projectTemplates, pt => pt.id === projectTemplateId)
    : getProjectTemplateByKey(projectTemplates, projectTemplateKey)
  // Ok still we are unable to find the project template, hence use project type to find that
  projectTemplate = !projectTemplate ? projectTemplates.filter(x => x.category === project.type)[0] : projectTemplate
  // icon for the product, use default generic work project icon for categories which no longer exist now
  const productIcon = _.get(projectTemplate, 'icon', 'tech-32px-outline-work-project')
  return (
    <div className="project-card-header" onClick={onClick}>
      <div className="project-header">
        <div className="project-type-icon" title={project.type !== undefined ? project.type[0].toUpperCase() + project.type.substr(1).replace(/_/g, ' ') : null}>
          <ProjectTypeIcon type={productIcon} />
        </div>
        <div className="project-header-details">
          <div className="project-name">
            <TextTruncate
              containerClassName="project-name"
              line={2}
              truncateText="..."
              text={project.name}
            />
          </div>
          <div className="project-date">{moment(project.updatedAt).format('MMM DD, YYYY')}</div>
        </div>
      </div>
    </div>
  )
}

ProjectCardHeader.defaultTypes = {
}

ProjectCardHeader.propTypes = {
  project: PT.object.isRequired,
  projectTemplates: PT.array.isRequired,
  onClick: PT.func
}

export default ProjectCardHeader
