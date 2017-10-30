import React, { PropTypes } from 'react'
import _ from 'lodash'
//import { branch, renderComponent, compose } from 'recompose'
import ProjectCard from './ProjectCard'
import NewProjectCard from './NewProjectCard'
import Walkthrough from '../Walkthrough/Walkthrough'

// import CoderBot from '../../../../components/CoderBot/CoderBot'
import { ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT
} from '../../../../config/constants'

// This handles showing a spinner while the state is being loaded async
// import spinnerWhileLoading from '../../../../components/LoadingSpinner'

/*
  Definiing default project criteria. This is used to later to determine if
  walkthrough component should be rendered instead of no results
 */
const defaultCriteria = {sort: 'createdAt desc'}

// const showErrorMessageIfError = hasLoaded =>
  // branch(hasLoaded, t => t, renderComponent(<CoderBot code={500} />))
// const errorHandler = showErrorMessageIfError(props => !props.error)
// const spinner = spinnerWhileLoading(props => !props.isLoading)
// const enhance = compose(errorHandler, spinner)

require('./ProjectsView.scss')


const ProjectsCardView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, totalCount, criteria, isLoading, currentUser} = props
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

  // show walk through if user is customer and no projects were returned
  // for default filters
  const showWalkThrough = !isLoading && totalCount === 0 &&
    _.isEqual(criteria, defaultCriteria) &&
    _.isEmpty(_.intersection(currentUser.roles,
      [ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT]
    ))

  const renderProject = (project, index) => {
    return (<div key={index} className="project-card">
      <ProjectCard
        project={project}
        currentUser={currentUser}
      />
    </div>)
  }
  return (
    <section className="">
      <div className="container">
        { showWalkThrough
          ? <Walkthrough currentUser={currentUser} />
          : <div className="projects card-view">
              { projects.map(renderProject)}
              <div className="project-card"><NewProjectCard /></div>
            </div>
        }
      </div>
    </section>
  )
}


ProjectsCardView.propTypes = {
  currentUser: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  members: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  sortHandler: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  criteria: PropTypes.object.isRequired
}

export default ProjectsCardView
