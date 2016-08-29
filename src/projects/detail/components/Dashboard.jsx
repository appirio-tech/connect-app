import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import TeamManagementContainer from './TeamManagementContainer'
import {
  PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_CUSTOMER
} from '../../../config/constants'

require('./ProjectDetail.scss')

class ProjectDashboard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { members, project } = this.props
    // fill project members from state.members object
    const projectMembers = _.map(project.members, m => {
      if (!m.userId) return m
      // map role
      switch (m.role) {
      case PROJECT_ROLE_COPILOT:
        m.isCopilot = true
        break
      case PROJECT_ROLE_CUSTOMER:
        m.isCustomer = true
        m.isPrimary = m.isPrimary || false
        break
      case PROJECT_ROLE_MANAGER:
        m.isManager = true
        break
      }
      return _.assign({}, m, {
        photoURL: ''
      },
      members[m.userId.toString()])
    })
    const prjObj = JSON.stringify(project, null, 2)
    return (
      <section className="project-detail two-col-content content">
        <div className="container">
          <div className="left-area">
            <div className="left-area-panel">
              <TeamManagementContainer projectId={project.id} members={projectMembers} />
            </div>
          </div>
          <div className="right-area">
            <div className="right-area-item">
              <h3>Name: {project.name}</h3>
              <pre>{prjObj}</pre>
            </div>
          </div>
        </div>
      </section>
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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard)
