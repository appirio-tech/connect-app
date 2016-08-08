import React, { PropTypes } from 'react'
import ProjectListItem from '../ProjectListItem/ProjectListItem'
import _ from 'lodash'

require('./ProjectList.scss')

const ProjectList = (({ projects, members }) => {

  // annotate projects with member data
  _.forEach(projects, prj => {
    prj.members = _.map(prj.members, m => {
      // there is some bad data in the system
      if (!m.userId) return m
      return _.assign({}, m, {
        photoURL: ''
      },
      members[m.userId.toString()])
    })
  })

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
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  members: PropTypes.object.isRequired
}

export default ProjectList
