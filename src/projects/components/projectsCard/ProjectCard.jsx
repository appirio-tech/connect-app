import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { getProjectRoleForCurrentUser } from '../../../helpers/projectHelper'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
import ProjectManagerAvatars from '../../list/components/Projects/ProjectManagerAvatars'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import './ProjectCard.scss'

function ProjectCard({ project, duration, disabled, currentUser, history, onChangeStatus, projectTemplates, unreadMentionsCount, callInviteRequest, isAcceptingInvite }) {
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
        <ProjectCardHeader unreadMentionsCount={unreadMentionsCount} project={project} projectTemplates={projectTemplates} />
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
            <div className="spacing join-btn-container">
              {(!isAcceptingInvite) && (
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    callInviteRequest(project, true)
                  }}
                  className={'tc-btn tc-btn-primary tc-btn-md blue join-btn'}
                  style={{margin: '5px'}}
                >
                  Join project
                </button>)}
              {(!isAcceptingInvite) && (
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    callInviteRequest(project, false)
                  }}
                  className="decline-btn"
                  style={{margin: '5px'}}
                >Decline</button>)}
              {isAcceptingInvite && (<LoadingIndicator isSmall />)}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

ProjectCard.defaultTypes = {
  callInviteRequest: () => {},
  isAcceptingInvite: false,
}

ProjectCard.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  projectTemplates: PT.array.isRequired,
  unreadMentionsCount: PT.number.isRequired,
  callInviteRequest: PT.func,
  isAcceptingInvite: PT.bool
  // duration: PT.object.isRequired,
}

export default withRouter(ProjectCard)
