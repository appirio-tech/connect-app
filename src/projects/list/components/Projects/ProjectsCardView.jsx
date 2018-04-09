import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'
import ProjectCard from './ProjectCard'
import NewProjectCard from './NewProjectCard'
import { PROJECTS_LIST_PER_PAGE } from '../../../../config/constants'
import { setDuration } from '../../../../helpers/projectHelper'

require('./ProjectsGridView.scss')


const ProjectsCardView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, currentUser, onPageChange, pageNum, totalCount, infiniteAutoload, setInfiniteAutoload, isLoading, onChangeStatus, projectsStatus } = props
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

  const renderProject = (project) => {
    const duration = setDuration({}, project.status)
    return (<div key={project.id} className="project-card">
      <ProjectCard
        project={project}
        currentUser={currentUser}
        duration={duration}
        onChangeStatus={onChangeStatus}
      />
    </div>)
  }
  const handleLoadMore = () => {
    onPageChange(pageNum + 1)
    setInfiniteAutoload(true)
  }
  const hasMore = pageNum * PROJECTS_LIST_PER_PAGE < totalCount
  const placeholders = []
  if (isLoading & hasMore) {
    for (let i = 0; i < PROJECTS_LIST_PER_PAGE; i++) {
      placeholders.push({ isPlaceholder: true })
    }
  }

  return (
    <div className="projects card-view">
      <InfiniteScroll
        initialLoad={false}
        pageStart={pageNum}
        loadMore={infiniteAutoload ? onPageChange : () => {}}
        hasMore={hasMore}
        threshold={500}
      >
        { [...projects, ...placeholders].map(renderProject)}
        <div className="project-card"><NewProjectCard /></div>
      </InfiniteScroll>
      { hasMore ?
        !isLoading && !infiniteAutoload && <button type="button" className="tc-btn tc-btn-primary" onClick={handleLoadMore} key="loadMore">Load more projects</button>
        : !isLoading && !infiniteAutoload && <div key="end" className="cardview-no-more">No more {projectsStatus} projects</div>}
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
  // applyFilters: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  // criteria: PropTypes.object.isRequired
  infiniteAutoload: PropTypes.bool,
  setInfiniteAutoload: PropTypes.func,
  isLoading: PropTypes.bool
}


ProjectsCardView.defaultProps = {
  infiniteAutoload : false
}

export default ProjectsCardView
