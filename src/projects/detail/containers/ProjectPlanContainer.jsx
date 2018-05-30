/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'

import { updateProduct, fireProductDirty, fireProjectDirtyUndo } from '../../actions/project'

import TwoColsLayout from '../components/TwoColsLayout'
import ProjectPlanProgress from '../components/ProjectPlanProgress'
import ProjectStages from '../components/ProjectStages'

const ProjectPlanContainer = (props) => {
  const {
    project,
    fireProductDirty,
  } = props

  return (
    <TwoColsLayout>
      <TwoColsLayout.Sidebar>
        &nbsp;
      </TwoColsLayout.Sidebar>

      <TwoColsLayout.Content>
        <ProjectPlanProgress project={project} />
        <ProjectStages {...props} fireProjectDirty={fireProductDirty} />
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
  productTemplates: projectState.productTemplates
})

const mapDispatchToProps = { updateProduct, fireProductDirty, fireProjectDirtyUndo }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPlanContainer)
