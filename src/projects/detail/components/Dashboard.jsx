import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

require('./Dashboard.scss')

class ProjectDashboard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // fill project members from state.members object
    const projectMembers = _.map(this.props.project.members, m => {
      if (!m.userId) return m
      return _.assign({}, m, {
        photoURL: ''
      },
      this.props.members[m.userId.toString()])
    })
    const members = JSON.stringify(projectMembers, null, 2)
    const prjObj = JSON.stringify(this.props.project, null, 2)
    return (
      <div className="dashboard flex">
        <div className="dashboard-main">
          <h3>Name: {this.props.project.name}</h3>
          <pre>{prjObj}</pre>
        </div>
        <div className="dashboard-sidebar">
          <pre>{members}</pre>
          {/*
            <ProjectProgress project={this.props.project} />
            <ProjectTeam project={this.props.members}>
          */}
        </div>
      </div>
    )
  }
}

ProjectDashboard.propTypes = {
  project: PropTypes.object.isRequired,
  members: PropTypes.object.isRequired
}

const mapStateToProps = ({members}) => {
  return {
    members: members.members
  }
}
export default connect(mapStateToProps)(ProjectDashboard)
