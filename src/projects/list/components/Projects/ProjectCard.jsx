import _ from 'lodash'
import moment from 'moment'
import React, { PropTypes as PT } from 'react'
import {Link} from 'react-router-dom'
import TextTruncate from 'react-text-truncate'
import { getProjectRoleForCurrentUser } from '../../../../helpers/projectHelper'
import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import AvatarGroup from '../../../../components/AvatarGroup/AvatarGroup'
import { findCategory } from '../../../../config/projectWizard'
import SVGIconImage from '../../../../components/SVGIconImage'
import { PROJECT_STATUS_ACTIVE } from '../../../../config/constants'
import './ProjectCard.scss'

function ProjectCard({ project, duration, disabled, currentUser, onChangeStatus}) {

  let className = `ProjectCard ${ disabled ? 'disabled' : 'enabled'}`
  if (!project) return null
  const currentMemberRole = getProjectRoleForCurrentUser({ project, currentUserId: currentUser.userId})
  const category = findCategory(project.type)
  // icon for the category, use default generic work project icon for categories which no longer exist now
  const categoryIcon =  _.get(category, 'icon', 'tech-32px-outline-work-project')
  return (
    <div
      className={className}
    >
      <div className="card-header">
        <Link className="read-more-link" to={`/projects/${project.id}/`}>
          <div className="project-header">
            <div className="project-type-icon"><SVGIconImage filePath={ categoryIcon } /></div>
            <div className="project-details">
              <TextTruncate
                containerClassName="project-name"
                line={2}
                truncateText="..."
                text={ project.name }
                title={project.name}
              />
              <div className="project-date">{ moment(project.updatedAt).format('MMM D') }</div>
            </div>
          </div>
        </Link>
      </div>
      <div className="card-body">
        <TextTruncate
          containerClassName="project-description"
          line={8}
          truncateText="..."
          text={ project.description }
          textTruncateChild={<Link className="read-more-link" to={`/projects/${project.id}/specification`}>read more &gt;</Link>}
        />
        <div className="project-status">
          { project.status !== PROJECT_STATUS_ACTIVE &&
            <ProjectStatus
              status={ project.status }
              showText
              withoutLabel
              currentMemberRole={ currentMemberRole }
              onChangeStatus={ onChangeStatus }
              canEdit={ false }
              unifiedHeader={ false }
            />
          }
          { project.status === PROJECT_STATUS_ACTIVE &&
            <ProjectProgress {...duration} viewType={ ProjectProgress.ViewTypes.CIRCLE } percent={46}>
              <span className="progress-text">{ duration.percent }% completed</span>
            </ProjectProgress>
          }
        </div>
      </div>
      <div className="card-footer">
        <AvatarGroup users={ project.members } />
      </div>
    </div>
  )
}

ProjectCard.defaultTypes = {
}

ProjectCard.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string
  // duration: PT.object.isRequired,
}

export default ProjectCard
