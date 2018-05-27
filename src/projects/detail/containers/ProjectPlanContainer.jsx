/**
 * ProjectPlanContainer container
 * displays content of the Project Plan tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'

import { updateProject, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'

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
}

const mapStateToProps = () => ({})

const mapDispatchToProps = { updateProject, fireProjectDirty, fireProjectDirtyUndo }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPlanContainer)
