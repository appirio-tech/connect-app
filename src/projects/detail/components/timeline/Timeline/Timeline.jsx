import React from 'react'
import PT from 'prop-types'
import moment from 'moment'

import TimelineHeader from '../TimelineHeader'
import TimelinePost from '../TimelinePost'

function buildContentForPhaseSpecification(milestone) {
  const currentStep = 0

  return [{
    id: 'a100',
    type: 'specification',
    buttonFinishTitle: 'Specification is completed',
    inProgress: (currentStep <= 0),
    isCompleted: (currentStep > 0),
  }]
}

const contentBuilders = {
  'phase-specification': buildContentForPhaseSpecification
}

function formatTimelinePostProps(milestone) {
  const startDate = moment(milestone.startDate)

  const currentStep = 0

  return {
    milestoneId: milestone.id,
    isUpdating: milestone.isUpdating,
    error: milestone.error,

    finish: () => {},
    postContent: {
      postId: milestone.id.toString(),
      inProgress: (currentStep <= 0),
      isCompleted: (currentStep > 0),
      month: startDate.format('MMM'),
      date: startDate.format('d'),
      title: milestone.type,
      postMsg: milestone.description,

      content: contentBuilders[milestone.type](milestone)
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
  }

  updateMilestone(milestoneId, values) {
    const {
      productId,
      updateProductMilestone,
      timeline,
    } = this.props

    console.warn('updateMilestone', milestoneId, values)

    updateProductMilestone(productId, timeline.id, milestoneId, values)
  }

  render() {
    const {
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
            updateMilestone={this.updateMilestone}
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
