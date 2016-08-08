import _ from 'lodash'
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames'

require('./ProjectListItem.scss')


const tempGetName = (user, isCopilotField) => {
  if (!user)
    return isCopilotField ? 'Unclaimed': 'Unknown'
  return _.get(user, 'handle', 'big_lebowski')
}

const ProjectListItem = ({ project, headerOnly = false, shouldAnimate = false }) => {
  const projectStyles = classNames(
    'ProjectListItem',
    { header : headerOnly }
  )

  let projectDOM = (
    <div className={ projectStyles }>
      <div className="projectName">Name</div>
      <div className="projectStatus">Status</div>
      <div className="projectStartsOn">Customer</div>
      <div className="projectEndsOn">Copilot</div>
    </div>
  )
  if (!headerOnly) {
    // get customerId
    const customer = _.find(project.members, m => m.role === 'customer' && m.isPrimary )
    const copilot = _.find(project.members, m => m.role === 'copilot' && m.isPrimary )

    projectDOM = (
      <div className={ projectStyles }>
        <Link className="projectName" to={`/projects/${project.id}`}>{ project.name }</Link>
        <div className="projectStatus">{ project.status }</div>
        <div className="projectStartsOn">{ tempGetName(customer, false) }</div>
        <div className="projectEndsOn">{ tempGetName(copilot, true) }</div>
      </div>
    )
  }

  if (shouldAnimate) {
    return (
      <ReactCSSTransitionGroup
        transitionName="project"
        transitionAppear
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {projectDOM}
      </ReactCSSTransitionGroup>
    )
  }

  return projectDOM
}

ProjectListItem.propTypes = {
  project: PropTypes.object.isRequired,
  shouldAnimate : PropTypes.bool
}

export default ProjectListItem
