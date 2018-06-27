/**
 * Work In Progress section for dashboard page
 */
import React from 'react'
import PT from 'prop-types'

import { Link } from 'react-router-dom'
import Section from '../Section'
import SectionTitle from '../SectionTitle'
import ProjectStage from '../ProjectStage'

import './WorkInProgress.scss'

const WorkInProgress = ({
  productTemplates, currentMemberRole, isProcessing, isSuperUser, isManageUser, project, activePhases, updateProduct,
  fireProductDirty, fireProductDirtyUndo, addProductAttachment, updateProductAttachment, removeProductAttachment
}) => {
  const renderActivePhases = (activePhase, index) => {
    return (
      <ProjectStage
        key={index}
        productTemplates={productTemplates}
        currentMemberRole={currentMemberRole}
        isProcessing={isProcessing}
        isSuperUser={isSuperUser}
        isManageUser={isManageUser}
        project={project}
        phase={activePhase}
        updateProduct={updateProduct}
        fireProductDirty={fireProductDirty}
        fireProductDirtyUndo={fireProductDirtyUndo}
        addProductAttachment={addProductAttachment}
        updateProductAttachment={updateProductAttachment}
        removeProductAttachment={removeProductAttachment}
      />
    )
  }
  return (
    <Section>
      <SectionTitle title="Work in progress">
        <Link to={`/projects/${project.id}/plan`} styleName="view-all">View all</Link>
      </SectionTitle>
      {activePhases.map(renderActivePhases)}
    </Section>
  )
}

WorkInProgress.propTypes = {
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  isManageUser: PT.bool.isRequired,
  updateProduct: PT.func.isRequired,
  fireProductDirty: PT.func.isRequired,
  fireProductDirtyUndo: PT.func.isRequired,
  addProductAttachment: PT.func.isRequired,
  updateProductAttachment: PT.func.isRequired,
  removeProductAttachment: PT.func.isRequired,
}

export default WorkInProgress
