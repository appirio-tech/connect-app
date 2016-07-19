import React from 'react'
// import _ from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ListContainer from '../ListContainer/ListContainer'
import ProjectList from '../ProjectList/ProjectList'
import LoadingListItem from '../LoadingListItem/LoadingListItem'
import PageError from '../PageError/PageError'
import NoResults from '../NoResults/NoResults'
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton'
import EndOfResults from '../EndOfResults/EndOfResults'
import ProjectsToolBar from '../ProjectsToolBar/ProjectsToolBar'

require('./ProjectsView.scss')

const ProjectsView = (props) => {
  const { pageLoaded, loadingMore, error } = props
  const { projects, totalCount, moreMatchesAvailable } = props
  const { previousSearchTerm: searchTerm } = props
  const { loadProjects } = props

  const projectMatches = renderProjects()
  const pageStatus = renderPageState()
  const loadMoreButton = renderLoadMoreButton()
  const endOfResults = renderEndOfResults()

  return (
    <div className="projects-view">
      <ProjectsToolBar onSearch={ loadProjects } />

      <div className="content-area">
        {pageStatus}

        {projectMatches}

        {loadMoreButton}

        {endOfResults}
      </div>
    </div>
  )

  function renderPageState() {
    if (error) {
      return (
        <ReactCSSTransitionGroup
          transitionName="page-error"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <PageError />
        </ReactCSSTransitionGroup>
      )

    } else if (searchTerm && pageLoaded && !projects.length) {
      return (
        <ReactCSSTransitionGroup
          transitionName="no-results"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <NoResults entry={searchTerm} />
        </ReactCSSTransitionGroup>
      )
    } else if (!pageLoaded && !projects.length) {
      const loadingListItems = []

      for (let i = 0; i < 10; i++) {
        loadingListItems.push(
          <LoadingListItem type={'PROJECT'} key={i} />
        )
      }

      return (
        <ReactCSSTransitionGroup
          transitionName="list-container"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <ListContainer
            headerText={'Loading projects...'}
          >
            <ul>
              {loadingListItems}
            </ul>
          </ListContainer>
        </ReactCSSTransitionGroup>
      )
    }
  }

  function renderProjects() {
    return (
      <div>
        <ProjectList projects={ projects } />
      </div>
    )
  }

  function renderLoadMoreButton() {
    const loadMoreProjects = () => {
      props.loadProjects(searchTerm)
    }

    if (moreMatchesAvailable && pageLoaded && !loadingMore && !error && projects.length === 10) {
      return <LoadMoreButton callback={loadMoreProjects}/>
    }

    if (moreMatchesAvailable && loadingMore && !error && projects.length === 10) {
      return <LoadMoreButton callback={loadMoreProjects} loading />
    }

    return null
  }

  function renderEndOfResults() {
    const numResults = projects.length

    // Don't show 'End of results' if the page is loading
    if (!pageLoaded) {
      return null

    // Or if there are more members to load
    } else if (numResults !== totalCount) {
      return null

    // Or if there are no results at all
    } else if (numResults === 0 && projects.length === 0) {
      return null

    } else {
      return <EndOfResults />
    }
  }
}

export default ProjectsView
