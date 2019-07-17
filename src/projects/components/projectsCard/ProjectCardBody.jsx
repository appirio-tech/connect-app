import React from 'react'
import PT from 'prop-types'
import TextTruncate from 'react-text-truncate'
import { Link } from 'react-router-dom'
import ProjectProgress from '../../../components/ProjectProgress/ProjectProgress'
import ProjectStatus from '../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../components/ProjectStatus/editableProjectStatus'
import { PROJECT_STATUS_ACTIVE, PROJECT_STATUS_COMPLETED, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER } from '../../../config/constants'
import './ProjectCardBody.scss'
import _ from 'lodash'

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

function ProjectCardBody({ project, projectCanBeActive, duration, currentMemberRole, descLinesCount = 8,
  onChangeStatus, isSuperUser, showLink, showLinkURL, canEditStatus = true, hideStatus }) {
  if (!project) return null

  const canEdit = canEditStatus && (
    project.status !== PROJECT_STATUS_COMPLETED && (isSuperUser || (currentMemberRole
    && (_.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1)))
  )

  const progress = _.get(process, 'percent', 0)

  const projectDetailsURL = project.version === 'v3'
    ? `/projects/${project.id}/scope`
    : `/projects/${project.id}/specification`

  return (
    <div className="project-card-body">
      <TextTruncate
        containerClassName="project-description"
        line={descLinesCount}
        truncateText="..."
        text={_.unescape(project.description)}
        textTruncateChild={showLink ? <Link className="read-more-link" to={showLinkURL || projectDetailsURL}>read more</Link> : <span className="read-more-link">read more</span>}
      />
      {!hideStatus && <div className="project-status">
        {(project.status !== PROJECT_STATUS_ACTIVE || progress === 0) &&
          <EnhancedProjectStatus
            status={project.status}
            projectCanBeActive={projectCanBeActive}
            showText
            withoutLabel
            currentMemberRole={currentMemberRole}
            canEdit={canEdit}
            unifiedHeader={false}
            onChangeStatus={onChangeStatus}
            projectId={project.id}
          />
        }
        {(project.status === PROJECT_STATUS_ACTIVE && progress !== 0) &&
          <ProjectProgress {...duration} viewType={ProjectProgress.ViewTypes.CIRCLE} percent={progress}>
            <span className="progress-text">{progress}% completed</span>
          </ProjectProgress>
        }
      </div>}
    </div>
  )
}

ProjectCardBody.defaultTypes = {
  projectCanBeActive: true,
  showLink: false,
  showLinkURL: '',
  canEditStatus: true
}

ProjectCardBody.propTypes = {
  project: PT.object.isRequired,
  projectCanBeActive: PT.bool,
  currentMemberRole: PT.string,
  duration: PT.object.isRequired,
  showLink: PT.bool,
  showLinkURL: PT.string,
  canEditStatus: PT.bool,
  hideStatus: PT.bool
}

export default ProjectCardBody
