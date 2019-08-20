/**
 * CompleteMilestoneButtonContainer
 *
 * Independent container component which implements button `Mark as Completed`.
 * This button can be placed in any place and it handles all the logic to complete work milestone.
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import { completeWorkMilestone } from '../../../actions/workTimelines'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'

class CompleteMilestoneButtonContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isConfirmationShown: false,
    }

    this.showConfirmation = this.showConfirmation.bind(this)
    this.hideConfirmation = this.hideConfirmation.bind(this)
    this.confirmMilestoneCompletion = this.confirmMilestoneCompletion.bind(this)
  }

  showConfirmation() {
    this.setState({
      isConfirmationShown: true,
    })
  }

  hideConfirmation() {
    this.setState({
      isConfirmationShown: false,
    })
  }

  confirmMilestoneCompletion() {
    const {
      completeWorkMilestone,
      workId,
      timelineId,
      milestoneId,
      onComplete,
    } = this.props

    this.hideConfirmation()

    completeWorkMilestone(workId, timelineId, milestoneId).then(() => {
      onComplete && onComplete()
    })
  }

  render() {
    const { isConfirmationShown } = this.state
    const { isUpdating } = this.props

    return (
      <div>
        {!isUpdating && (
          <button
            className="tc-btn tc-btn-warning tc-btn-sm"
            onClick={this.showConfirmation}
          >
            Mark as Completed
          </button>
        )}

        {isUpdating && (
          <LoadingIndicator />
        )}

        <Modal
          isOpen={isConfirmationShown}
          className="delete-post-dialog"
          overlayClassName="delete-post-dialog-overlay"
          onRequestClose={this.hideConfirmation}
          contentLabel=""
        >

          <div className="modal-title">
            Confirm
          </div>

          <div className="modal-body">
            Are you sure you want to mark this milestone as complete?
          </div>

          <div className="button-area flex center action-area">
            <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={this.hideConfirmation}>Cancel</button>
            <button className="tc-btn tc-btn-warning tc-btn-sm action-btn" onClick={this.confirmMilestoneCompletion}>Mark as Completed</button>
          </div>
        </Modal>
      </div>
    )
  }
}

CompleteMilestoneButtonContainer.propTypes = {
  workId: PT.number.isRequired,
  timelineId: PT.number.isRequired,
  milestoneId: PT.number.isRequired,
  onComplete: PT.func,
  completeWorkMilestone: PT.func.isRequired,
}

const mapStateToProps = ({ workTimelines }) => ({
  isUpdating: workTimelines.isUpdatingMilestoneInfo
})

const mapDispatchToProps = {
  completeWorkMilestone,
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteMilestoneButtonContainer)