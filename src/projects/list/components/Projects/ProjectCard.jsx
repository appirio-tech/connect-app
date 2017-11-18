import React, { PropTypes as PT } from 'react'
import {Link} from 'react-router-dom'
import { getProjectRoleForCurrentUser } from '../../../../helpers/projectHelper'
import AvatarGroup from '../../../../components/AvatarGroup/AvatarGroup'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
import './ProjectCard.scss'

function ProjectCard({ project, duration, disabled, currentUser }) {

  let className = `ProjectCard ${ disabled ? 'disabled' : 'enabled'}`
  if (!project) return null
  const currentMemberRole = getProjectRoleForCurrentUser({ project, currentUserId: currentUser.userId})
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
