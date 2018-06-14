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

  let actualDuration = 0
  let now = Date()
  now = now && moment(now)
  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i]
    const startDate = phase.startDate && moment(phase.startDate)
    const duration = now.diff(startDate, 'days') + 1
    if (duration <= phase.directProject.plannedDuration) {
      if (duration > 0) {
        actualDuration += duration
      }
      break
    } else {
      actualDuration += phase.directProject.plannedDuration
    }
  }
  const projectedDuration = _.sumBy(_.uniqBy(phases, 'directProject.project.projectId'), 'directProject.plannedDuration') + 1

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
