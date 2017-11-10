import _ from 'lodash'
import moment from 'moment'
import React, { PropTypes as PT } from 'react'
import TextTruncate from 'react-text-truncate'
import { findCategory } from '../../../../config/projectWizard'
import SVGIconImage from '../../../../components/SVGIconImage'
import './ProjectCardHeader.scss'

function ProjectCardHeader({ project }) {
  if (!project) return null

  const category = findCategory(project.type)
  // icon for the category, use default generic work project icon for categories which no longer exist now
  const categoryIcon = _.get(category, 'icon', 'tech-32px-outline-work-project')
  return (
    <div className="project-card-header">
      <div className="project-header">
        <div className="project-type-icon"><SVGIconImage filePath={categoryIcon} /></div>
        <div className="project-header-details">
          <div className="project-name">
            <TextTruncate
              containerClassName="project-name"
              line={1}
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
  project: PT.object.isRequired
}

export default ProjectCardHeader
