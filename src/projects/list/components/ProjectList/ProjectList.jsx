import React, { PropTypes } from 'react'
import Project from '../Project/Project'

require('./ProjectList.scss')

const ProjectList = (({ projects }) => {

  const renderProject = (project, idx) => {
    return (<Project project={ project } key={ idx } />)
  }


  return (
    <div className="project-list">
      { projects.map(renderProject) }
    </div>
  )
})

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ProjectList
