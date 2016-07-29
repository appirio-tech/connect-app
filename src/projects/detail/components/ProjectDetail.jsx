
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {fetchProject} from '../../../actions/project'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'



class ProjectDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const projectId = this.props.params.projectId
    this.props.fetchProject(projectId)
  }

  render() {
    // handle loading state
    if (this.props.isLoading) {
      return (
        <LoadingIndicator />
      )
    } else {
      const children = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          project: this.props.project
        })
      })
      return (
        <div>{children}</div>
      )
    }
  }
}

const mapStateToProps = ({projectState}) => {
  return {
    isLoading: projectState.isLoading,
    project: projectState.project
  }
}
const mapDispatchToProps = { fetchProject }

ProjectDetail.propTypes = {
  project   : PropTypes.object.isRequired,
  isLoading : PropTypes.bool.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail)
