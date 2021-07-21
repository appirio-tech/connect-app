/**
 * Create simple project plan
 */
import React from 'react'
import PT from 'prop-types'
import GenericMenu from '../../../../../components/GenericMenu'
import ProjectDetailsWidget from '../ProjectDetailsWidget'
import ManageMilestones from '../ManageMilestones'

import './CreateSimpleplan.scss'

const createTabs = ({ onClick } ) => ([
  {
    label: 'MILESTONES',
    isActive: true,
    onClick,
  }
])

function CreateSimpleplan({
  project,
  phases,
  milestones,
  onChangeMilestones,
  onSaveMilestone,
  onRemoveMilestone,
  isProjectLive
})  {
  const onClickMilestonesTab = () => {}

  return (
    <div styleName="container">
      <ProjectDetailsWidget project={project} phases={phases} />
      <div styleName="milestones-container">
        <div styleName="tabs-header">
          <GenericMenu navLinks={createTabs(onClickMilestonesTab)} />
        </div>
        <ManageMilestones
          milestones={milestones}
          onChangeMilestones={onChangeMilestones}
          onSaveMilestone={onSaveMilestone}
          onRemoveMilestone={onRemoveMilestone}
          projectMembers={project.members}
          isProjectLive={isProjectLive}
        />
      </div>
    </div>
  )
}

CreateSimpleplan.propTypes = {
  project: PT.shape(),
  phases: PT.arrayOf(PT.shape()),
  milestones: PT.arrayOf(PT.shape()),
  onChangeMilestones: PT.func,
  onSaveMilestone: PT.func,
  onRemoveMilestone: PT.func,
}

export default CreateSimpleplan
