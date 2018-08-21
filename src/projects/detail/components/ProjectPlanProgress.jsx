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
  phases,
  productsTimelines
}) => (
  <Section>
    <SectionTitle title="Project status" />
    <ProjectProgress {...formatProjectProgressProps(project, phases, productsTimelines)} />
  </Section>
)

ProjectPlanProgress.defaultProps = {
  phases: []
}

ProjectPlanProgress.propTypes = {
  project: PT.object.isRequired,
  phases: PT.array,
  productsTimelines: PT.object.isRequired
}

export default ProjectPlanProgress
