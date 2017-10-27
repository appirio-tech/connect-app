import _ from 'lodash'
import moment from 'moment'
import React, { PropTypes as PT } from 'react'
import {Link} from 'react-router'
import TextTruncate from 'react-text-truncate'
import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import ProjectStatusSection from '../../../../components/ProjectStatusSection/ProjectStatusSection'
import AvatarGroup from '../../../../components/AvatarGroup/AvatarGroup'
import { findCategory } from '../../../../config/projectWizard'
import SVGIconImage from '../../../../components/SVGIconImage'
import './ProjectCard.scss'

function isEllipsisActive(el) {
  return (el.offsetHeight < el.scrollHeight)
}

function ProjectCard({ project, duration, disabled , currentMemberRole, onChangeStatus}) {

  let className = `ProjectCard ${ disabled ? 'disabled' : 'enabled'}`
  if (!project) return null
  console.log(project.members)

  const category = findCategory(project.type)
  return (
    <div
      className={className}
    >
      <div className="card-header">
        <div className="project-header">
          <div className="project-type-icon"><SVGIconImage filePath={category.icon} /></div>
          <div className="project-details">
            <div className="project-name">{ project.name }</div>
            <div className="project-date">{ moment(project.updatedAt).format('MMM D') }</div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="project-description">
          <TextTruncate
            // containerClassName="project-description"
            line={8}
            truncateText="..."
            text={ project.description }
            textTruncateChild={<Link className="read-more-link" to={`/projects/${project.id}/specification`}>read more &gt;</Link>}
          />
        </div>
        <div className="project-status">
          <ProjectStatus
            status={ project.status }
            showText={ true }
            withoutLabel={ true }
            currentMemberRole={ currentMemberRole }
            onChangeStatus={ onChangeStatus }
            canEdit={ false }
            unifiedHeader={ false }
          />
        {

          // <ProjectProgress {...duration}>
          //   {duration.text}
          // </ProjectProgress>
        }
        </div>
      </div>
      <div className="card-footer">
        <AvatarGroup users={ project.members }></AvatarGroup>
      </div>
    </div>
  )
}

ProjectCard.defaultTypes = {
}

ProjectCard.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  // duration: PT.object.isRequired,
}

export default ProjectCard
