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
import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'
import Sticky from 'react-stickynode'

const ProjectPlanContainer = (props) => {
  const {
    project,
    isSuperUser,
    currentMemberRole,
    phases,
  } = props

  const leftArea = (
    <ProjectInfoContainer
      currentMemberRole={currentMemberRole}
      project={project}
      isSuperUser={isSuperUser}
    />
  )
  return (
    <TwoColsLayout>
      <TwoColsLayout.Sidebar>
        <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
          {(matches) => {
            if (matches) {
              return <Sticky top={60}>{leftArea}</Sticky>
            } else {
              return leftArea
            }
          }}
        </MediaQuery>
      </TwoColsLayout.Sidebar>

      <TwoColsLayout.Content>
        <ProjectPlanProgress phases={phases} project={project} />
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
  productTemplates: projectState.allProductTemplates,
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
