/**
 * WorkstreamsContainer container
 * displays content of the workstreams list section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import Workstreams from '../components/workstreams/Workstreams'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

const spinner = spinnerWhileLoading(props => props.workstreams && !props.isLoadingWorkstreams)
const WorkstreamsWithLoader = spinner(Workstreams)


class WorkstreamsContainer extends React.Component {
  componentWillMount() {
    const { project, workstreams, loadProjectWorkstreams } = this.props
    if (!workstreams) {
      loadProjectWorkstreams(project)
    }
  }

  render() {
    return (
      <WorkstreamsWithLoader
        {...this.props}
      />
    )
  }
}

WorkstreamsContainer.defaultProps = {
  addWorkForWorkstream: () => {}
}

WorkstreamsContainer.PropTypes = {
  loadProjectWorkstreams: PT.func.isRequired,
  isLoadingWorkstreams: PT.bool.isRequired,
  workstreams: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
    status: PT.string.isRequired,
    description: PT.string,
  })),
  addWorkForWorkstream: PT.func.isRequired,
  timelines: PT.array.isRequired,
  isManageUser: PT.bool,
  permissions: PT.object.isRequired,
}


export default withRouter(WorkstreamsContainer)
