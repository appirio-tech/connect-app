/**
 * WorkViewContainer container
 * displays content of the workview section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import spinnerWhileLoading from '../../../components/LoadingSpinner'
import WorkView from '../components/workstreams/WorkView'

import { loadTopic } from '../../../actions/topics'


// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.isLoadingWorkInfo && !_.isNil(props.work))
const WorkViewWithLoader = enhance(WorkView)


class WorkViewContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {
      match: { params: { projectId, workstreamId, workId } },
      loadWorkInfo,
      work,
      loadTopic,
      topics,
    } = this.props
    if (!work || `${work.id}` !== workId) {
      loadWorkInfo(projectId, workstreamId, workId)
    }

    // start loading all the comments for work if not yet loaded or started loading
    [`work#${workId}-details`, `work#${workId}-requirements`].forEach((topicTag) => {
      if (!topics[topicTag]) {
        loadTopic(projectId, topicTag)
      }
    })
  }

  render() {
    return (
      <WorkViewWithLoader
        {...this.props}
      />
    )
  }
}

WorkViewContainer.PropTypes = {
  isLoadingWorkInfo: PT.bool.isRequired,
  loadWorkInfo: PT.func.isRequired,
  work: PT.object.isRequired,
  timelines: PT.object.isRequired,
  inputDesignWorks: PT.func.isRequired,
  markMilestoneAsCompleted: PT.func,
  topics: PT.array,
  loadTopic: PT.func.isRequired,
}

const mapStateToProps = ({ topics }) => ({
  topics,
})

const mapDispatchToProps = {
  loadTopic,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkViewContainer))
