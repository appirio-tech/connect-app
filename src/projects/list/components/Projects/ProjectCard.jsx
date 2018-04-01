import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { getProjectRoleForCurrentUser } from '../../../../helpers/projectHelper'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
import ProjectManagerAvatars from './ProjectManagerAvatars'
import MediaQuery from 'react-responsive'
import './ProjectCard.scss'

function ProjectCard({ project, duration, disabled, currentUser, history, onChangeStatus}) {
  const className = `ProjectCard ${ disabled ? 'disabled' : 'enabled'}`
  if (!project) return null
  const currentMemberRole = getProjectRoleForCurrentUser({ project, currentUserId: currentUser.userId})
  return (
    <div className={className}>
      <div className="card-header">
        <ProjectCardHeader
          project={project}
          onClick={() => {
            history.push(`/projects/${project.id}/`)
          }}
        />
      </div>
      <div className="card-body">
        <MediaQuery minWidth={768}>
          {(matches) => (
            <ProjectCardBody
              project={project}
              currentMemberRole={currentMemberRole}
              duration={duration}
              onChangeStatus={onChangeStatus}
              showLink
              showLinkURL={matches ? `/projects/${project.id}/specification` : `/projects/${project.id}`}
            />
          )}
        </MediaQuery>
      </div>
      <div className="card-footer">
        <ProjectManagerAvatars managers={project.members} maxShownNum={10} />
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
