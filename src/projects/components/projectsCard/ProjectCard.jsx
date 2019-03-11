import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { withRouter, Link } from 'react-router-dom'
import { getProjectRoleForCurrentUser } from '../../../helpers/projectHelper'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
import ProjectManagerAvatars from '../../list/components/Projects/ProjectManagerAvatars'
import './ProjectCard.scss'

function ProjectCard({ project, duration, disabled, currentUser, history, onChangeStatus, projectTemplates }) {
  const className = `ProjectCard ${ disabled ? 'disabled' : 'enabled'}`
  if (!project) return null
  const currentMemberRole = getProjectRoleForCurrentUser({ project, currentUserId: currentUser.userId})
  // check whether is the project's member
  const isMember = _.some(project.members, m => (m.userId === currentUser.userId && m.deletedAt === null))
  // check whether has pending invition
  const isInvited = _.some(project.invites, m => ((m.userId === currentUser.userId || m.email === currentUser.email) && !m.deletedAt && m.status === 'pending'))
  return (
    <div
      className={className}
      onClick={() => {
        history.push(`/projects/${project.id}/`)
      }}
    >
      <div className="card-header">
        <ProjectCardHeader project={project} projectTemplates={projectTemplates} />
      </div>
      <div className="card-body">
        <ProjectCardBody
          project={project}
          currentMemberRole={currentMemberRole}
          duration={duration}
          onChangeStatus={onChangeStatus}
          showLink
          showLinkURL={`/projects/${project.id}/specification`}
          canEditStatus={false}
        />
      </div>
      <div className="card-footer">
        <ProjectManagerAvatars managers={project.members} maxShownNum={10} />
        <div>
          {(!isMember && isInvited) &&
            <Link to={`/projects/${project.id}`} className="spacing">
              <div className="join-btn" style={{margin: '5px'}}>
                Join project
              </div>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

ProjectCard.defaultTypes = {
}

ProjectCard.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  projectTemplates: PT.array.isRequired,
  // duration: PT.object.isRequired,
}

export default withRouter(ProjectCard)
