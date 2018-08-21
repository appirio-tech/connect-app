/**
 * Timeline component
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import TimelineHeader from '../TimelineHeader'
import Milestone from '../Milestone'

class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.updateMilestone = this.updateMilestone.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
    this.completeFinalFixesMilestone = this.completeFinalFixesMilestone.bind(this)
    this.extendMilestone = this.extendMilestone.bind(this)
    this.submitFinalFixesRequest = this.submitFinalFixesRequest.bind(this)
  }

  updateMilestone(milestoneId, values) {
    const {
      product,
      updateProductMilestone,
      timeline,
    } = this.props

    updateProductMilestone(product.id, timeline.id, milestoneId, values)
  }

  completeMilestone(milestoneId, updatedProps = {}) {
    const {
      product,
      completeProductMilestone,
      timeline,
    } = this.props

    completeProductMilestone(product.id, timeline.id, milestoneId, updatedProps)
  }

  completeFinalFixesMilestone(milestoneId, updatedProps = {}) {
    const {
      product,
      completeFinalFixesMilestone,
      timeline,
    } = this.props

    completeFinalFixesMilestone(product.id, timeline.id, milestoneId, updatedProps)
  }

  extendMilestone(milestoneId, extendDuration, updatedProps = {}) {
    const {
      product,
      extendProductMilestone,
      timeline,
    } = this.props

    extendProductMilestone(product.id, timeline.id, milestoneId, extendDuration, updatedProps)
  }

  submitFinalFixesRequest(milestoneId, finalFixRequests) {
    const {
      product,
      submitFinalFixesRequest,
      timeline,
    } = this.props

    submitFinalFixesRequest(product.id, timeline.id, milestoneId, finalFixRequests)
  }

  render() {
    const {
      currentUser,
      timeline,
    } = this.props

    //Ordering milestones wrt "order" before rendering
    const orderedMilestones = timeline.milestones ? _.orderBy(timeline.milestones, ['order']) : []
    return (
      <div>
        <TimelineHeader
          postContent={{
            title: timeline.name,
            postMsg: timeline.description,
          }}
        />
        {_.reject(orderedMilestones, { hidden: true }).map((milestone) => (
          <Milestone
            key={milestone.id}
            currentUser={currentUser}
            milestone={milestone}
            updateMilestone={this.updateMilestone}
            completeMilestone={this.completeMilestone}
            extendMilestone={this.extendMilestone}
            submitFinalFixesRequest={this.submitFinalFixesRequest}
            completeFinalFixesMilestone={this.completeFinalFixesMilestone}
            //$TODO convert the below logic more optimized way
            previousMilestone={_.find(orderedMilestones, m => m.order === milestone.order-1) &&
               _.find(orderedMilestones, m => m.order === milestone.order-1).type}
          />
        ))}
      </div>
    )
  }
}

Timeline.defaultProps = {
  isLoading: false,
}

Timeline.propType = {
  isLoading: PT.bool,
  product: PT.object.isRequired,
  timeline: PT.object.isRequired,
  updateProductMilestone: PT.func.isRequired,
  completeProductMilestone: PT.func.isRequired,
  extendProductMilestone: PT.func.isRequired,
}

export default Timeline
