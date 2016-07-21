import React, { Component } from 'react'

require('./Dashboard.scss')

class ProjectDashboard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // TODO - add more
    return (
      <div className="dashboard flex">
        <div className="dashboard-main">
          <h3>Name: {this.props.project.title}</h3>
        </div>
        <div className="dashboard-sidebar">
          {/*
            <ProjectProgress project={this.props.project} />
            <ProjectTeam project={this.props.members}>
          */}
        </div>
      </div>
    )
  }
}

ProjectDashboard.propTypes = {}

ProjectDashboard.defaultProps = {}

export default ProjectDashboard
