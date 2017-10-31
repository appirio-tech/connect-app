import React, { PropTypes } from 'react'
import _ from 'lodash'
import ProjectCard from './ProjectCard'
import NewProjectCard from './NewProjectCard'

import { setDuration } from '../../../../helpers/projectHelper'

require('./ProjectsGridView.scss')


const ProjectsCardView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, currentUser} = props
  // const currentSortField = _.get(criteria, 'sort', '')

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

  const renderProject = (project, index) => {
    const duration = setDuration({}, project.status)
    return (<div key={index} className="project-card">
      <ProjectCard
        project={project}
        currentUser={currentUser}
        duration={duration}
      />
    </div>)
  }
  return (
    <div className="projects card-view">
      { projects.map(renderProject)}
      <div className="project-card"><NewProjectCard /></div>
    </div>
  )
}


ProjectsCardView.propTypes = {
  currentUser: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  members: PropTypes.object.isRequired,
  // isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired
  // there are no pagination, no sorting feature or no filtering for card view
  // hence commented all next
  // onPageChange: PropTypes.func.isRequired,
  // sortHandler: PropTypes.func.isRequired,
  // applyFilters: PropTypes.func.isRequired,
  // pageNum: PropTypes.number.isRequired,
  // criteria: PropTypes.object.isRequired
}

export default ProjectsCardView
