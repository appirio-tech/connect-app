import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames'
import { CONNECT_DOMAIN } from '../../config/constants'

require('./Project.scss')

const Project = ({ project, shouldAnimate = false }) => {
  const projectStyles = classNames(
    'project'
  )

  const projectDOM = (
    <div className="Project">
      <Link className="projectName" to={`/projects/${project.id}`}>{ project.name }</Link>
      <div className="projectCurrentPhase">{ project.currentPhase }</div>
      <div className="projectStartsOn">{ project.startsOn }</div>
      <div className="projectEndsOn">{ project.endsOn }</div>
    </div>
  )

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

Project.propTypes = {
  project       : PropTypes.object.isRequired,
  shouldAnimate : PropTypes.bool
}

export default Project
