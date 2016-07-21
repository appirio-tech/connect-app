
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {loadProject} from '../../actions/project'


class ProjectDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    let projectId = this.props.params.projectId
    this.props.loadProject(projectId)
  }

  render() {
    var children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        project: this.props.project
      })
    })

    return (
      <div>{children}</div>
    )
  }
}

const mapStateToProps = ({currentProject}) => {
  return {
    isLoading: currentProject.isLoading,
    project: currentProject.project
  }
}
const mapDispatchToProps = { loadProject }

ProjectDetail.propTypes = {
  project: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail)
