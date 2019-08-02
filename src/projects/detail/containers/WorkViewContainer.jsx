/**
 * WorkViewContainer container
 * displays content of the workview section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import spinnerWhileLoading from '../../../components/LoadingSpinner'
import WorkView from '../components/workstreams/WorkView'


// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.isLoadingWorkInfo)
const EnhancedCreateView = enhance(WorkView)


class WorkViewContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { match: { params: { projectId, workstreamId, workId } }, loadWorkInfo, work } = this.props
    if (!work || `${work.id}` !== workId) {
      loadWorkInfo(projectId, workstreamId, workId)
    }
  }

  render() {
    return (
      <EnhancedCreateView
        {...this.props}
      />
    )
  }
}

WorkViewContainer.PropTypes = {
  isLoadingWorkInfo: PT.bool.isRequired,
  loadWorkInfo: PT.func.isRequired,
  work: PT.object.isRequired,
}


export default withRouter(WorkViewContainer)
