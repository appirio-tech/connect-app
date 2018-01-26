import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { getProjectRoleForCurrentUser } from '../../../../helpers/projectHelper'
import AvatarGroup from '../../../../components/AvatarGroup/AvatarGroup'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
import './ProjectCard.scss'

function ProjectCard({ project, duration, disabled, currentUser, history, onChangeStatus}) {
  let className = `ProjectCard ${ disabled ? 'disabled' : 'enabled'}`
  if (!project) return null
  const currentMemberRole = getProjectRoleForCurrentUser({ project, currentUserId: currentUser.userId})
  return (
    <div
      className={className}
      onClick={() => {
        history.push(`/projects/${project.id}/`)
      }}
    >
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
          onChangeStatus={onChangeStatus}
        />
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

export default withRouter(ProjectCard)
