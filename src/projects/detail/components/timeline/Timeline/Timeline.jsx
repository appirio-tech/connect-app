import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import TimelineHeader from '../TimelineHeader'
import TimelinePost from '../TimelinePost'

class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.updateMilestone = this.updateMilestone.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
    this.extendMilestone = this.extendMilestone.bind(this)
    this.submitFinalFixesRequest = this.submitFinalFixesRequest.bind(this)
  }

  updateMilestone(milestoneId, values) {
    const {
      productId,
      updateProductMilestone,
      timeline,
    } = this.props

    updateProductMilestone(productId, timeline.id, milestoneId, values)
  }

  completeMilestone(milestoneId, updatedProps = {}) {
    const {
      productId,
      completeProductMilestone,
      timeline,
    } = this.props

    completeProductMilestone(productId, timeline.id, milestoneId, updatedProps)
  }

  extendMilestone(milestoneId, extendDuration, updatedProps = {}) {
    const {
      productId,
      extendProductMilestone,
      timeline,
    } = this.props

    extendProductMilestone(productId, timeline.id, milestoneId, extendDuration, updatedProps)
  }

  submitFinalFixesRequest(milestoneId, finalFixRequests) {
    const {
      productId,
      submitFinalFixesRequest,
      timeline,
    } = this.props

    submitFinalFixesRequest(productId, timeline.id, milestoneId, finalFixRequests)
  }

  render() {
    const {
      currentUser,
      timeline,
    } = this.props

    return (
      <div>
        <TimelineHeader
          postContent={{
            title: timeline.name,
            postMsg: timeline.description,
          }}
        />
        {_.reject(timeline.milestones, { hidden: true }).map((milestone) => (
          <TimelinePost
            key={milestone.id}
            currentUser={currentUser}
            milestone={milestone}
            updateMilestone={this.updateMilestone}
            completeMilestone={this.completeMilestone}
            extendMilestone={this.extendMilestone}
            submitFinalFixesRequest={this.submitFinalFixesRequest}
          />
        ))}
      </div>
    )
  }
}

Timeline.propType = {
  name: PT.string.isRequired,
  description: PT.string,
  milestones: PT.array.isRequired,
}

export default Timeline
