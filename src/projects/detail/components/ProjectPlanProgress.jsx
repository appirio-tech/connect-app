/**
 * Project Plan Progress section
 */
import React from 'react'
import PT from 'prop-types'

import { formatProjectProgressProps } from '../../../helpers/projectHelper'

import Section from './Section'
import SectionTitle from './SectionTitle'
import ProjectProgress from './ProjectProgress'

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
