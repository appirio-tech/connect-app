import React, { PropTypes as PT } from 'react'
import { Link } from 'react-router-dom'
import TextTruncate from 'react-text-truncate'
import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../../components/ProjectStatus/editableProjectStatus'
import { PROJECT_STATUS_ACTIVE, PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER } from '../../../../config/constants'
import './ProjectCardBody.scss'
import _ from 'lodash'

function ProjectCardBody({ project, duration, currentMemberRole, descLinesCount = 8,
  onChangeStatus, isSuperUser }) {
  if (!project) return null

  const canEdit = isSuperUser || (currentMemberRole
    && (_.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1))

  const progress = _.get(process, 'percent', 0)

  const EnhancedProjectStatus = canEdit ? editableProjectStatus(ProjectStatus) : ProjectStatus

  return (
    <div className="project-card-body">
      <TextTruncate
        containerClassName="project-description"
        line={descLinesCount}
        truncateText="..."
        text={project.description}
        textTruncateChild={<span><Link className="read-more-link" to={`/projects/${project.id}/specification`}> read more </Link></span>}
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
}

ProjectCardBody.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  duration: PT.object.isRequired
}

export default ProjectCardBody
