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

/**
 * Format ProjectProgress props
 *
 * @param {Object} project project object
 *
 * @return {Object} ProjectProgress props
 */
function formatProjectProgressProps(project, phases) {
  const actualDuration =  _.sumBy(phases, 'directProject.actualDuration')

  const startDates = _.compact(phases.map((phase) =>
    phase.startDate ? moment(phase.startDate) : null
  ))
  const endDates = _.compact(phases.map((phase) =>
    phase.endDate ? moment(phase.endDate) : null
  ))
  const minStartDate = startDates.length > 0 ? moment.min(startDates) : null
  const maxEndDate = endDates.length > 0 ? moment.max(endDates) : null
  const projectedDuration = maxEndDate.diff(minStartDate, 'days') + 1


  const labelDayStatus = `Day ${actualDuration} of ${projectedDuration}`
  const labelSpent = `Spent $${_.get(project, 'budget.actualCost')}`
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

ProjectPlanProgress.propTypes = {
  project: PT.object.isRequired,
}

export default ProjectPlanProgress
