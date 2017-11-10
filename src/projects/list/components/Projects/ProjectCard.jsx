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
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
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
    <Link to={`/projects/${project.id}/`} className={className}>
      <div className="card-header">
          <ProjectCardHeader
            project={project}
          />
      </div>
      <div className="card-body">
        <ProjectCardBody
          project={project}
          currentMemberRole={currentMemberRole}
          duration={duration}
        />
      </div>
      <div className="card-footer">
        <AvatarGroup users={ project.members } />
      </div>
    </Link>
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
