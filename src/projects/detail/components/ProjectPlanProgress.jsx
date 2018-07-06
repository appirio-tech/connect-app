/**
 * Project Plan Progress section
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'

import { formatNumberWithCommas } from '../../../helpers/format'
import Section from './Section'
import SectionTitle from './SectionTitle'
import ProjectProgress from './ProjectProgress'

import {
  PHASE_STATUS_ACTIVE,
  PHASE_STATUS_COMPLETED,
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

  let totalProgress = 0

  // phases where start date is set
  const filteredPhases = _.filter(phases, (phase) => (phase.startDate))
  filteredPhases.map((phase) => {
    let progress = 0
    // calculates days spent and day based progress for the phase
    if (phase.startDate && phase.duration) {
      const startDate = moment(phase.startDate)
      const duration = now.diff(startDate, 'days') + 1
      if(duration >= 0) {
        if(duration < phase.duration || duration === phase.duration) {
          progress = (duration / phase.duration) * 100
          actualDuration += duration
        } else {
          progress = 100
          actualDuration += phase.duration
        }
      }
    }
    // override the progress use custom progress set by manager
    if (phase.progress) {
      progress = phase.progress
    }
    // override project progress if status is delivered
    if (phase.status === PHASE_STATUS_COMPLETED) {
      progress = 100
      //this line could be added if we want the progress bar to consider complete duration of phase,
      // incase phase is marked completed before actual endDate
      //actualDuration += phase.duration
    }
    totalProgress += progress
  })
  const projectedDuration = _.sumBy(phases, (phase) => {
    return phase.duration && phase.duration > 1 ? phase.duration : 1
  })

  const labelDayStatus = `Day ${actualDuration} of ${projectedDuration}`
  

  const activeOrCompletedPhases = _.filter(phases, (phase) => (
    phase.status === PHASE_STATUS_ACTIVE || phase.status === PHASE_STATUS_COMPLETED)
  )
  const spentAmount = _.sumBy(activeOrCompletedPhases, 'spentBudget') || 0
  const labelSpent = `Spent $${formatNumberWithCommas(spentAmount)}`
  const progressPercent = phases.length > 0 ? Math.round(totalProgress/phases.length) : 0
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
