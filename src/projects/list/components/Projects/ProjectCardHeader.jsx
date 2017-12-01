import _ from 'lodash'
import moment from 'moment'
import React, { PropTypes as PT } from 'react'
import TextTruncate from 'react-text-truncate'
import { findProduct } from '../../../../config/projectWizard'
import SVGIconImage from '../../../../components/SVGIconImage'
import './ProjectCardHeader.scss'

function ProjectCardHeader({ project }) {
  if (!project) return null

  const productType = _.get(project, 'details.products[0]')
  const product = findProduct(productType)
  // icon for the product, use default generic work project icon for categories which no longer exist now
  const productIcon = _.get(product, 'icon', 'tech-32px-outline-work-project')
  return (
    <div className="project-card-header">
      <div className="project-header">
        <div className="project-type-icon" title={project.type !== undefined ? project.type[0].toUpperCase() + project.type.substr(1).replace(/_/g, ' ') : null}><SVGIconImage filePath={productIcon} /></div>
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
