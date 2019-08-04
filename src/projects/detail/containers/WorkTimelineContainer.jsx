/**
 * WorkTimelineContainer container
 * displays content of the work timeline section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import WorkTimeline from '../components/work-timeline/WorkTimeline'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import { loadWorkTimelines } from '../../actions/workTimelines'

const spinner = spinnerWhileLoading(props => !props.isLoadingTimelines)
const EnhancedCreateView = spinner(WorkTimeline)


class WorkTimelineContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // load timeline
    const { loadWorkTimelines, loadedTimelinesWorkId, workId } = this.props
    if (loadedTimelinesWorkId !== workId) {
      loadWorkTimelines(workId)
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

WorkTimelineContainer.PropTypes = {
  workId: PT.number.isRequired,
  editMode: PT.bool.isRequired,
  isLoadingTimelines: PT.bool.isRequired,
  timelines: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    startDate: PT.string,
    milestones: PT.arrayOf(PT.shape({
      id: PT.number,
      startDate: PT.string,
      endDate: PT.string,
      name: PT.string,
    })),
  })).isRequired,
  loadWorkTimelines: PT.func.isRequired,
}

const mapStateToProps = ({ workTimelines }) => {
  return {
    timelines: workTimelines.timelines,
    loadedTimelinesWorkId: workTimelines.workId, // work id that already loaded timelines
    isLoadingTimelines: workTimelines.isLoading,
  }
}

const mapDispatchToProps = {
  loadWorkTimelines
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkTimelineContainer))
