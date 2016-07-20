
import React, { PropTypes, Component } from 'react'
import ProjectToolBar from './ProjectToolBar/ProjectToolBar.jsx'

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className=''>
        <ProjectToolBar project={this.props.project} />
        <span>this is a test</span>
        { this.props.children }
      </div>
    )
  }
}

ProjectDetail.propTypes = {}

ProjectDetail.defaultProps = {
  project: {
    name: 'Test Project',
    id: 1,
    description: "This is a rather short description of the project",
    details: {
      features: ['login', 'dashboard', 'analytics']
    }
  }
}

export default ProjectDetail
