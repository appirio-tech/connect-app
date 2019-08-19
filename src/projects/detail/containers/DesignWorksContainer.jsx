/**
 * DesignWorksContainer container
 * displays form for inputing design work document
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import DesignWorks from '../components/workstreams/DesignWorks'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

import {
  loadWorkMilestone,
  updateWorkMilestone,
} from '../../actions/workTimelines'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import './DesignWorksContainer.scss'

// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.isLoadingMilestoneInfo && !!props.milestoneId)
const EnhancedCreateView = enhance(DesignWorks)

class DesignWorksContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { timelineId, milestoneId, milestone, loadWorkMilestone, work } = this.props
    if (!milestone || (milestone.id !== milestoneId)) {
      loadWorkMilestone(work.id, timelineId, milestoneId)
    }
  }

  render() {
    const {
      isUpdatingMilestoneInfo,
      isDeletingMilestoneInfo,
      milestone
    } = this.props
    return (
      <div styleName="container">
        <EnhancedCreateView
          {...this.props}
          milestone={milestone}
        />
        {(isUpdatingMilestoneInfo || isDeletingMilestoneInfo) && (<div styleName="loading-wrapper">
          <LoadingIndicator />
        </div>)}
      </div>
    )
  }
}

DesignWorksContainer.PropTypes = {
  timelineId: PT.number.isRequired,
  milestoneId: PT.number.isRequired,
  onBack: PT.func.isRequired,
}

const mapStateToProps = ({workTimelines, works}) => {
  return {
    timelines: workTimelines.timelines,
    isUpdatingMilestoneInfo: workTimelines.isUpdatingMilestoneInfo,
    isDeletingMilestoneInfo: workTimelines.isDeletingMilestoneInfo,
    isLoadingMilestoneInfo: workTimelines.isLoadingMilestoneInfo,
    isRequestMilestoneError: !!workTimelines.error,
    milestone: workTimelines.milestone,
    work: works.work
  }
}

const mapDispatchToProps = {
  loadWorkMilestone,
  updateWorkMilestone
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DesignWorksContainer))