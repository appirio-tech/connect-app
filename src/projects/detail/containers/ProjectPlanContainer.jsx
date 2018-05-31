/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'

import { updateProduct, fireProductDirty, fireProductDirtyUndo } from '../../actions/project'
import { addProductAttachment, updateProductAttachment, removeProductAttachment } from '../../actions/projectAttachment'

import TwoColsLayout from '../components/TwoColsLayout'
import ProjectPlanProgress from '../components/ProjectPlanProgress'
import ProjectStages from '../components/ProjectStages'

const ProjectPlanContainer = (props) => {
  const {
    project,
  } = props

  return (
    <TwoColsLayout>
      <TwoColsLayout.Sidebar>
        &nbsp;
      </TwoColsLayout.Sidebar>

      <TwoColsLayout.Content>
        <ProjectPlanProgress project={project} />
        <ProjectStages {...props} />
      </TwoColsLayout.Content>
    </TwoColsLayout>
  )
}

ProjectPlanContainer.propTypes = {
  currentMemberRole: PT.string.isRequired,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  project: PT.object.isRequired,
  productTemplates: PT.array.isRequired,
}

const mapStateToProps = ({ projectState }) => ({
  productTemplates: projectState.productTemplates,
  phases: projectState.phases,
})

const mapDispatchToProps = {
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPlanContainer)
