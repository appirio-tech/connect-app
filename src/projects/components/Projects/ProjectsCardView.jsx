import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'
import ProjectCard from './ProjectCard'
import NewProjectCard from './NewProjectCard'
import cn from 'classnames'
import { PROJECTS_LIST_PER_PAGE } from '../../../config/constants'
import { setDuration } from '../../../helpers/projectHelper'

require('./ProjectsGridView.scss')


const ProjectsCardView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, currentUser, onPageChange, pageNum, totalCount, infiniteAutoload,
    setInfiniteAutoload, isLoading, onChangeStatus, projectsStatus, projectTemplates, applyFilters } = props
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
        projectTemplates={projectTemplates}
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

  const moreProject = (isBeforeNewCard) => !isLoading && !infiniteAutoload && (
    <div className={cn('more-wrapper', {'more-wrapper-before-new-card': isBeforeNewCard})}>
      {hasMore
        ? <button type="button" className="tc-btn tc-btn-primary" onClick={handleLoadMore} key="loadMore">Load more projects</button>
        : <div key="end" className="cardview-no-more">No more {projectsStatus} projects</div>
      }
    </div>
  )

  if (totalCount === 0) {
    return (
      <div className="projects card-view">
        <div key="end" className="cardview-no-project">No results found based on current search criteria. <br /> Please modify your search criteria and/or search across all projects by selecting the "
        <a href="javascript:" onClick={() => { applyFilters({status: null }) }} className="tc-btn-all-projects" >
          All Projects
        </a>
        " filter.
        </div>
      </div>
    )
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
        {moreProject(true)}
        <div className="project-card project-card-new"><NewProjectCard /></div>
      </InfiniteScroll>
      {moreProject(false)}
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
  applyFilters: PropTypes.func,
  isLoading: PropTypes.bool,
  projectTemplates: PropTypes.array.isRequired,
}


ProjectsCardView.defaultProps = {
  infiniteAutoload : false
}

export default ProjectsCardView
