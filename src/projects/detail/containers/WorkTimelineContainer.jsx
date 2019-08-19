/**
 * WorkTimelineContainer container
 * displays content of the work timeline section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'

import WorkTimeline from '../components/work-timeline/WorkTimeline'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import { loadWorkTimeline } from '../../actions/workTimelines'

const spinner = spinnerWhileLoading(props => props.timelineState && !props.timelineState.isLoading)
const WorkTimelineWithLoader = spinner(WorkTimeline)


class WorkTimelineContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // load timeline if we still didn't try to load it
    const { timelineState, workId, loadWorkTimeline } = this.props
    if (!timelineState && workId) {
      loadWorkTimeline(workId)
    }
  }

  render() {
    return (
      <WorkTimelineWithLoader
        {...this.props}
      />
    )
  }
}

WorkTimelineContainer.PropTypes = {
  workId: PT.number.isRequired,
  editMode: PT.bool.isRequired,
  timelineState: PT.shape({
    isLoading: PT.bool,
    timeline: PT.shape({
      id: PT.number.isRequired,
      startDate: PT.string,
      milestones: PT.arrayOf(PT.shape({
        id: PT.number.isRequired,
        startDate: PT.string,
        endDate: PT.string,
        name: PT.string.isRequired,
      })),
    }).isRequired,
  }).isRequired,
}

const mapStateToProps = ({ workTimelines }, ownProps) => ({
  timelineState: workTimelines.timelines[ownProps.workId],
})

const mapDispatchToProps = {
  loadWorkTimeline
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkTimelineContainer)
