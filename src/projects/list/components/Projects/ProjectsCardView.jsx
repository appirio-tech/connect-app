import React, { PropTypes } from 'react'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'
import ProjectCard from './ProjectCard'
import NewProjectCard from './NewProjectCard'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'

import { setDuration } from '../../../../helpers/projectHelper'

require('./ProjectsGridView.scss')


const ProjectsCardView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, currentUser, onPageChange, pageNum, totalCount, inifinite } = props
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
  const handleLoadMore = () => {
    onPageChange(pageNum + 1)
  }
  const hasMore = ((pageNum - 1) * 20 + 20 < totalCount)
  return (
    <div className="projects card-view">
      { !!inifinite && 
        <InfiniteScroll
          initialLoad={false}
          pageStart={pageNum}
          loadMore={onPageChange}
          hasMore={ hasMore }
          loader={<LoadingIndicator />}
        >
          { projects.map(renderProject)}
          <div className="project-card"><NewProjectCard /></div>
        </InfiniteScroll>
      }
      { !inifinite &&
        <div>
          { projects.map(renderProject)}
          <div className="project-card"><NewProjectCard /></div>
        </div>
      }
      { !inifinite && hasMore && <button type="button" className="tc-btn tc-btn-primary" onClick={handleLoadMore}>Load more</button> }
      { !hasMore && <span>End of results</span>}
    </div>
  )
}


ProjectsCardView.propTypes = {
  currentUser: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  members: PropTypes.object.isRequired,
  // isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  // there are no pagination, no sorting feature or no filtering for card view
  // hence commented all next
  // onPageChange: PropTypes.func.isRequired,
  // sortHandler: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired
}


ProjectsCardView.defaultProps = {
  inifinite : false
}

export default ProjectsCardView
