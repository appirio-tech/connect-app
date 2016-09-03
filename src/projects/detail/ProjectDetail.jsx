
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { loadProjectDashboard } from '../actions/projectDashboard'
import spinnerWhileLoading from '../../components/LoadingSpinner'


// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.isLoading)
const ProjectDetailView = enhance((props) => {
  const children = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      project: props.project,
      isCurrentUserMember: props.isCurrentUserMember
    })
  })
  return <div>{children}</div>
})

class ProjectDetail extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    const projectId = this.props.params.projectId
    this.props.loadProjectDashboard(projectId)
  }

  isCurrentUserMember({currentUserId, project}) {
    return project && !!_.find(project.members, m => m.userId === currentUserId)
  }

  render() {
    const isMember = this.isCurrentUserMember(this.props)
    return <ProjectDetailView {...this.props} isCurrentUserMember={isMember} />
  }
}

const mapStateToProps = ({projectState, projectDashboard, loadUser}) => {
  return {
    currentUserId: parseInt(loadUser.user.id),
    isLoading: projectDashboard.isLoading,
    error: projectDashboard.error,
    project: projectState.project
  }
}
const mapDispatchToProps = { loadProjectDashboard }

ProjectDetail.propTypes = {
  project   : PropTypes.object.isRequired,
  isLoading : PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail)
