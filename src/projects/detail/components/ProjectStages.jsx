/**
 * Project stages section
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'

import { formatNumberWithCommas } from '../../../helpers/format'

import Section from '../components/Section'
import ProjectStage from '../components/ProjectStage'
import PhaseCardListHeader from '../components/PhaseCardListHeader'
import PhaseCardListFooter from '../components/PhaseCardListFooter'

/**
 * Format PhaseCardListFooter props
 *
 * @param {Array} phases phases
 *
 * @returns {Object} PhaseCardListFooter props
 */
function formatPhaseCardListFooterProps(phases) {
  const startDates = _.compact(phases.map((phase) =>
    phase.startDate ? moment(phase.startDate) : null
  ))
  const endDates = _.compact(phases.map((phase) =>
    phase.endDate ? moment(phase.endDate) : null
  ))
  const minStartDate = startDates.length > 0 ? moment.min(startDates) : null
  const maxEndDate = endDates.length > 0 ? moment.max(endDates) : null

  let startEndDates = minStartDate ? `${minStartDate.format('MMM D')}` : ''
  startEndDates += minStartDate && maxEndDate ? `–${maxEndDate.format('MMM D')}` : ''

  const totalPrice = _.sum(phases.map((phase) => _.get(phase, 'products[0].budget', 0)))

  const duration = `${minStartDate && maxEndDate ? moment.duration(maxEndDate.diff(minStartDate)).days() : 0} days`
  const price = `$${formatNumberWithCommas(totalPrice)}`

  return {
    duration,
    startEndDates,
    price,
  }
}

const ProjectStages = ({
  project,
  phases,
  productTemplates,
  currentMemberRole,
  isProcessing,
  isSuperUser,
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
}) => (
  <Section>
    <PhaseCardListHeader />
    {phases.map((phase) => (
      <ProjectStage
        key={phase.id}
        productTemplates={productTemplates}
        currentMemberRole={currentMemberRole}
        isProcessing={isProcessing}
        isSuperUser={isSuperUser}
        project={project}
        phase={phase}
        updateProduct={updateProduct}
        fireProductDirty={fireProductDirty}
        fireProductDirtyUndo={fireProductDirtyUndo}
        addProductAttachment={addProductAttachment}
        updateProductAttachment={updateProductAttachment}
        removeProductAttachment={removeProductAttachment}
      />
    ))}
    <PhaseCardListFooter {...formatPhaseCardListFooterProps(phases)} />
  </Section>
)

ProjectStages.defaultProps = {
  currentMemberRole: null,
}

ProjectStages.propTypes = {
  project: PT.object.isRequired,
  productTemplates: PT.array.isRequired,
  currentMemberRole: PT.string,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  updateProduct: PT.func.isRequired,
  fireProductDirty: PT.func.isRequired,
  fireProductDirtyUndo: PT.func.isRequired,
  addProductAttachment: PT.func.isRequired,
  updateProductAttachment: PT.func.isRequired,
  removeProductAttachment: PT.func.isRequired,
}

export default ProjectStages
