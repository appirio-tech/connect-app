import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames'
import { CONNECT_DOMAIN } from '../../config/constants'
import { loadProject } from '../../actions/loadProject'
import ProjectToolBar from '../ProjectToolBar/ProjectToolBar'

require('./ProjectView.scss')


class ProjectView extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log('loading project..' + this.props.params.projectId)
    this.props.loadProject(this.props.params.projectId)
  }

  render() {
    const {shouldAnimate, project} = this.props
    const recentProjects = []
    const projectStyles = classNames(
      'project'
    )

    const projectDOM = (
      <div>
        <ProjectToolBar project={project} recentProjects={ recentProjects } domain={ CONNECT_DOMAIN } />
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
}

ProjectView.propTypes = {
  project       : PropTypes.object.isRequired,
  shouldAnimate : PropTypes.bool
}


const mapStateToProps = ({ loadProject }) => {
  return {
    pageLoaded             : loadProject.pageLoaded,
    error                  : loadProject.error,
    project                : loadProject.project
  }
}

const actionsToBind = { loadProject }

export default connect(mapStateToProps, actionsToBind)(ProjectView)
