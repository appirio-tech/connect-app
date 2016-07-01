import React, { PropTypes } from 'react'
import Project from '../Project/Project'

require('./ProjectList.scss')

const ProjectList = (({ projects }) => {
  return (
    <div className="project-list">
      {projects.map((project, i) =>
        <Project key={i} project={project} />
      )}
    </div>
  )
})

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ProjectList
