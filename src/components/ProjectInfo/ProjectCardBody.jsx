import React, { PropTypes as PT } from 'react'
import { Link } from 'react-router-dom'
import TextTruncate from 'react-text-truncate'
import ProjectProgress from '../ProjectProgress/ProjectProgress'
import ProjectStatus from '../ProjectStatus/ProjectStatus'
import { PROJECT_STATUS_ACTIVE } from '../../config/constants'
import './ProjectCardBody.scss'

function ProjectCardBody({ project, duration, currentMemberRole }) {
  if (!project) return null

  return (
    <div className="project-card-body">
      <TextTruncate
        containerClassName="project-description"
        line={4}
        truncateText="..."
        text={project.description}
        textTruncateChild={<span><Link className="read-more-link" to={`/projects/${project.id}/specification`}> read more </Link></span>}
      />
      <div className="project-status">
        {project.status !== PROJECT_STATUS_ACTIVE &&
          <ProjectStatus
            status={project.status}
            showText
            withoutLabel
            currentMemberRole={currentMemberRole}
            canEdit={false}
            unifiedHeader={false}
          />
        }
        {project.status === PROJECT_STATUS_ACTIVE &&
          <ProjectProgress {...duration} viewType={ProjectProgress.ViewTypes.CIRCLE} percent={46}>
            <span className="progress-text">{duration.percent}% completed</span>
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
