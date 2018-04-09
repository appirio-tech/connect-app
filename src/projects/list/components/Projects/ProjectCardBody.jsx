import React from 'react'
import PT from 'prop-types'
import TextTruncate from 'react-text-truncate'
import { Link } from 'react-router-dom'
import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../../components/ProjectStatus/editableProjectStatus'
import { PROJECT_STATUS_ACTIVE, PROJECT_STATUS_COMPLETED, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER } from '../../../../config/constants'
import './ProjectCardBody.scss'
import _ from 'lodash'

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

function ProjectCardBody({ project, duration, currentMemberRole, descLinesCount = 8,
  onChangeStatus, isSuperUser, showLink, showLinkURL }) {
  if (!project) return null

  const canEdit = project.status !== PROJECT_STATUS_COMPLETED && (isSuperUser || (currentMemberRole
    && (_.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1)))

  const progress = _.get(process, 'percent', 0)

  return (
    <div className="project-card-body">
      <TextTruncate
        containerClassName="project-description"
        line={descLinesCount}
        truncateText="..."
        text={project.description}
        textTruncateChild={showLink ? <Link className="read-more-link" to={showLinkURL || `/projects/${project.id}/specification`}>read more</Link> : <span className="read-more-link">read more</span>}
      />
      <div className="project-status">
        {(project.status !== PROJECT_STATUS_ACTIVE || progress === 0) &&
          <EnhancedProjectStatus
            status={project.status}
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
      </div>
    </div>
  )
}

ProjectCardBody.defaultTypes = {
  showLink: false,
  showLinkURL: ''
}

ProjectCardBody.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  duration: PT.object.isRequired,
  showLink: PT.bool,
  showLinkURL: PT.string
}

export default ProjectCardBody
