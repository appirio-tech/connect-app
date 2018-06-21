/**
 * Project Plan Progress section
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'

import Section from './Section'
import SectionTitle from './SectionTitle'
import ProjectProgress from './ProjectProgress'

import {
  PHASE_STATUS_IN_PROGRESS,
  PHASE_STATUS_DELIVERED,
} from '../../../config/constants'

/**
 * Format ProjectProgress props
 *
 * @param {Object} project project object
 *
 * @return {Object} ProjectProgress props
 */
function formatProjectProgressProps(project, phases) {
  let actualDuration = 0
  let now = new Date()
  now = now && moment(now)

  const filteredPhases = _.filter(phases, (phase) => (phase.startDate))
  filteredPhases.map((phase) => {
    const startDate = moment(phase.startDate)
    const duration = now.diff(startDate, 'days')
    if(duration >= 0) {
      if(duration <= phase.duration) {
        actualDuration += duration
      } else {
        actualDuration += phase.duration
      }
    }
  })

  const projectedDuration = _.sumBy(phases, 'duration') + phases.length

  const labelDayStatus = `Day ${actualDuration} of ${projectedDuration}`
  
  const labelSpent = `Spent $${(_.sumBy(_.filter(phases, (phase) => (phase.status === PHASE_STATUS_IN_PROGRESS || phase.status === PHASE_STATUS_DELIVERED)), 'spentBudget') || 0)}`
  const progressPercent = (projectedDuration !== 0 ? Math.round(actualDuration * 100 / projectedDuration) : 0).toString()
  const labelStatus = `${progressPercent}% done`

  return {
    labelDayStatus,
    labelSpent,
    labelStatus,
    progressPercent,
  }
}

const ProjectPlanProgress = ({
  project,
  phases
}) => (
  <Section>
    <SectionTitle title="Project status" />
    <ProjectProgress {...formatProjectProgressProps(project, phases)} />
  </Section>
)

ProjectPlanProgress.defaultProps = {
  phases: []
}

ProjectPlanProgress.propTypes = {
  project: PT.object.isRequired,
  phases: PT.array
}

export default ProjectPlanProgress
