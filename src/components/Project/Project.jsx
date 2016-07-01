import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames'
import { CONNECT_DOMAIN } from '../../config/constants'

require('./Project.scss')

const Project = ({ project, shouldAnimate = false }) => {
  const projectStyles = classNames(
    'project'
  )

  const projectDOM = (
    <a
      className={projectStyles}
      href={`https://www.${CONNECT_DOMAIN}/projects/${project.id}`}
    >
      { project.name }
    </a>
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
