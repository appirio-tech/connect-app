import React from 'react'
import PT from 'prop-types'
import moment from 'moment'

import TimelineHeader from '../TimelineHeader'
import TimelinePost from '../TimelinePost'

function formatTimelinePostProps(milestone) {
  const startDate = moment(milestone.startDate)

  return {
    milestoneId: milestone.id,
    isUpdating: milestone.isUpdating,
    error: milestone.error,

    finish: () => {},
    postContent: {
      month: startDate.format('MMM'),
      date: startDate.format('d'),
      title: milestone.type,
      postMsg: milestone.description,
    },
    editableData: {
      title: milestone.type,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      plannedText: milestone.plannedText,
      activeText: milestone.activeText,
      blockedText: milestone.blockedText,
      completedText: milestone.completedText,
    }
  }
}

class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.updateMilestone = this.updateMilestone.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
    this.extendMilestone = this.extendMilestone.bind(this)
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
        {timeline.milestones.map((milestone) => (
          <TimelinePost
            key={milestone.id}
            {...formatTimelinePostProps(milestone)}
            currentUser={currentUser}
            milestone={milestone}
            updateMilestone={this.updateMilestone}
            completeMilestone={this.completeMilestone}
            extendMilestone={this.extendMilestone}
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
