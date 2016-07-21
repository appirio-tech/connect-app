import React, { PropTypes } from 'react'
import ProjectListItem from '../ProjectListItem/ProjectListItem'

require('./ProjectList.scss')

const ProjectList = (({ projects }) => {

  const renderProject = (project, idx) => {
    return (<ProjectListItem project={ project } key={ idx } />)
  }

  return (
    <div className="project-list">
      <ProjectListItem  headerOnly />
      { projects.map(renderProject) }
    </div>
  )
})

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ProjectList
