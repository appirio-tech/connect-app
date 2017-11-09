import React, { PropTypes as PT } from 'react'
import ProjectCardHeader from './ProjectCardHeader'
import ProjectCardBody from './ProjectCardBody'
import './ProjectInfo.scss'

function ProjectInfo({ project, duration, currentMemberRole }) {
  if (!project) return null

  return (
    <div className="project-info">
      <ProjectCardHeader
        project={project}
      />
      <ProjectCardBody
        project={project}
        currentMemberRole={currentMemberRole}
        duration={duration}
      />
    </div>
  )
}

ProjectInfo.defaultTypes = {
}

ProjectInfo.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  duration: PT.object.isRequired
}

export default ProjectInfo
