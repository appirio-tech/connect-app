import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import { getProjectRoleForCurrentUser } from '../../../helpers/projectHelper'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import ProjectManagerAvatars from '../../list/components/Projects/ProjectManagerAvatars'
import './ProjectCard.scss'

class ProjectCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showLoader: false
    }
    this.inviteAction = this.inviteAction.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { processingProjectMemberInvite } = this.props
    if(processingProjectMemberInvite && !nextProps.processingProjectMemberInvite) {
      this.setState({ showLoader: false })
    }
  }

  inviteAction(join, projectId) {
    this.setState({ showLoader: true })
    this.props.onUserInviteAction(join, projectId)
  }

  render() {
    const { project, duration, disabled, currentUser, history, onChangeStatus, projectTemplates, unreadMentionsCount, processingProjectMemberInvite } = this.props
    const { showLoader } = this.state
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
            {(!isMember && isInvited && !processingProjectMemberInvite) &&
              <div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    this.inviteAction(false, project.id)
                  }}
                  className="join-btn" style={{margin: '5px'}}
                >
                  Decline
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    this.inviteAction(true, project.id)
                  }}
                  className="join-btn tc-btn tc-btn-primary tc-btn-md" style={{margin: '5px'}}
                >
                  Join project
                </button>
              </div>
            }
            {processingProjectMemberInvite && showLoader && (
              <LoadingIndicator />
            )}
          </div>
        </div>
      </div>
    )
  }
}

ProjectCard.defaultTypes = {
}

ProjectCard.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  projectTemplates: PT.array.isRequired,
  unreadMentionsCount: PT.number.isRequired,
  onChangeStatus: PT.func,
  processingProjectMemberInvite: PT.bool
  // duration: PT.object.isRequired,
}

export default withRouter(ProjectCard)
