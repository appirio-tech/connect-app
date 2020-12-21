/**
 * Timeline component
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import Milestone from '../Milestone'
import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import NotificationsReader from '../../../../../components/NotificationsReader'
import CreateMilestoneForm from '../CreateMilestoneForm'

import { buildPhaseTimelineNotificationsCriteria } from '../../../../../routes/notifications/constants/notifications'
import './Timeline.scss'

class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      height: 0,
      isEditing: false
    }
    this.updateHeight = this.updateHeight.bind(this)

    this.onAddClick = this.onAddClick.bind(this)
    this.updateMilestone = this.updateMilestone.bind(this)
    this.createMilestone = this.createMilestone.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
    this.completeFinalFixesMilestone = this.completeFinalFixesMilestone.bind(this)
    this.extendMilestone = this.extendMilestone.bind(this)
    this.submitFinalFixesRequest = this.submitFinalFixesRequest.bind(this)
    this.submitDeliverableFinalFixesRequest = this.submitDeliverableFinalFixesRequest.bind(this)
  }

  componentWillReceiveProps() {
    this.updateHeight()
  }

  componentDidUpdate() {
    this.updateHeight()
  }

  updateHeight() {
    if (this.div && this.div.clientHeight > 0 && this.state.height === 0) {
      this.setState({ height: this.div.clientHeight })
    }
  }

  onCancelClick() {
    this.setState({
      isEditing: true
    })
  }
  onSubmitClick() {
    this.setState({
      isEditing: false
    })
  }
  onAddClick() {
    this.setState({
      isEditing: true
    })
  }


  updateMilestone(milestoneId, values) {
    const {
      product,
      updateProductMilestone,
      timeline,
    } = this.props

    updateProductMilestone(product.id, timeline.id, milestoneId, values)
  }

  createMilestone(milestone) {
    const {
      createProductMilestone,
      timeline,
    } = this.props

    const orderedMilestones = timeline.milestones ? _.orderBy(timeline.milestones, ['order']) : []
    milestone.order = orderedMilestones.length ?  _.last(orderedMilestones).order + 1 : 1
    
    createProductMilestone(timeline, [...timeline.milestones, milestone])
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

  submitDeliverableFinalFixesRequest(milestoneId, finalFixesRequest) {
    const {
      product,
      submitDeliverableFinalFixesRequest,
      timeline,
    } = this.props

    submitDeliverableFinalFixesRequest(product.id, timeline.id, milestoneId, finalFixesRequest)
  }

  render() {
    const {
      currentUser,
      timeline,
      isLoading,
      phaseId,
      project,
    } = this.props

    if (isLoading || _.some(timeline.milestones, 'isUpdating')) {
      const divHeight = `${this.state.height}px`
      return (<div style={{ height: divHeight, minHeight: divHeight }}><LoadingIndicator /></div>)
    } else {
      //Ordering milestones wrt "order" before rendering
      const orderedMilestones = timeline.milestones ? _.orderBy(timeline.milestones, ['order']) : []
      return (
        <div ref={ div => { this.div = div } }>
          <NotificationsReader 
            key="notifications-reader"
            id={`phase-${phaseId}-timeline-${timeline.id}`}
            criteria={buildPhaseTimelineNotificationsCriteria(timeline)}
          />
          {_.reject(orderedMilestones, { hidden: true }).map((milestone, index) => (
            <Milestone
              key={milestone.id}
              currentUser={currentUser}
              index={index}
              milestone={milestone}
              updateMilestone={this.updateMilestone}
              completeMilestone={this.completeMilestone}
              extendMilestone={this.extendMilestone}
              submitFinalFixesRequest={this.submitFinalFixesRequest}
              completeFinalFixesMilestone={this.completeFinalFixesMilestone}
              submitDeliverableFinalFixesRequest={this.submitDeliverableFinalFixesRequest}
              //$TODO convert the below logic more optimized way
              previousMilestone={_.find(orderedMilestones, m => m.order === milestone.order-1) &&
               _.find(orderedMilestones, m => m.order === milestone.order-1).type}
              project={project}
            />
          ))}
          <CreateMilestoneForm 
            onSubmit={this.createMilestone}
          />
        </div>
      )
    }
  }
}

Timeline.defaultProps = {
  isLoading: false,
}

Timeline.propType = {
  isLoading: PT.bool,
  product: PT.object.isRequired,
  timeline: PT.object.isRequired,
  createProductMilestone: PT.func.isRequired,
  updateProductMilestone: PT.func.isRequired,
  createTimelineMilestone: PT.func.isRequired,
  completeProductMilestone: PT.func.isRequired,
  extendProductMilestone: PT.func.isRequired,
  submitDeliverableFinalFixesRequest: PT.func.isRequired,
}

export default Timeline
