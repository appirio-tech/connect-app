/**
 * Project Plan Progress section
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

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
function formatProjectProgressProps(project) {
  const actualDuration = _.get(project, 'duration.actualDuration', 0)
  const projectedDuration = _.get(project, 'duration.projectedDuration', 0)

  const labelDayStatus = `Day ${actualDuration} of ${projectedDuration}`
  const labelSpent = `Spent $${_.get(project, 'budget.actualCost')}`
  const progressPercent = (projectedDuration !== 0 ? actualDuration / projectedDuration : 0).toString()
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
}) => (
  <Section>
    <SectionTitle title="Project status" />
    <ProjectProgress {...formatProjectProgressProps(project)} />
  </Section>
)

ProjectPlanProgress.propTypes = {
  project: PT.object.isRequired,
}

export default ProjectPlanProgress
