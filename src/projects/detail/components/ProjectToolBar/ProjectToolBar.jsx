require('./ProjectToolBar.scss')

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuBar from 'appirio-tech-react-components/components/MenuBar/MenuBar'
import { connect } from 'react-redux'
import { LOAD_PROJECT_FAILURE } from '../../../../config/constants'

class ProjectToolBar extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {project, userRoles, isLoading, error} = this.props
    if (isLoading || error && error.type === LOAD_PROJECT_FAILURE)
      return <noscript />

    //TODO prepare navigation items according to roles of the user
    const primaryNavigationItems = [
      {
        //img: require('./nav-projects.svg'),
        text: 'Dashboard',
        link: `/projects/${project.id}/`
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Project Details',
        link: `/projects/${project.id}/specification/`
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Messages',
        link: `/projects/${project.id}/messages/`
      }
    ]
    const isCopilotOrManager = !!userRoles.find((r) => {
      r = r.toLowerCase()
      return r.indexOf('copilot') > -1 || r.indexOf('manager') > -1
    })
    if (isCopilotOrManager) {
      primaryNavigationItems.splice(2, 0, {
        //img: require('./nav-projects.svg'),
        text: 'Challenges',
        link: `/projects/${project.id}/challenges/`
      })
    }

    return (
      <div className="ProjectToolBar flex middle space-between">
        <h3 className="project-name">{ project.name }</h3>
        <MenuBar items={primaryNavigationItems} orientation="horizontal" forReactRouter />
      </div>
    )
  }
}
const mapStateToProps = ({projectState}) => {
  return {
    isLoading: projectState.isLoading,
    project: projectState.project,
    error: projectState.error
  }
}

ProjectToolBar.propTypes = {
  userRoles : PropTypes.arrayOf(PropTypes.string).isRequired,
  project   : PropTypes.object,
  error     : PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  isLoading : PropTypes.bool.isRequired
}

// TODO remove this once we have data coming from JWT
ProjectToolBar.defaultProps = {
  userRoles: ['Topcoder User']
}

export default connect(mapStateToProps)(ProjectToolBar)
