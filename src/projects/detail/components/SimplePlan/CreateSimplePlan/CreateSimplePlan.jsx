/**
 * Create simple project plan
 */
import React from 'react'
import PT from 'prop-types'
import GenericMenu from '../../../../../components/GenericMenu'
// import ProjectDetailsWidget from '../ProjectDetailsWidget'
import ManageMilestones from '../ManageMilestones'
import * as milestoneHelper from '../components/helpers/milestone'

import styles from './CreateSimplePlan.scss'
import MilestonesApprovalNotification from '../components/MilestonesApprovalNotification'
import { PHASE_STATUS_IN_REVIEW } from '../../../../../config/constants'

const createTabs = ({ onClick } ) => ([
  {
    label: 'MILESTONES',
    isActive: true,
    onClick,
  }
])

class CreateSimplePlan extends React.Component {
  componentDidMount() {
    const contentInnerElement = document.querySelector('.twoColsLayout-contentInner')
    contentInnerElement.classList.add(styles['twoColsLayout-contentInner'])
  }

  componentWillUnmount() {
    const contentInnerElement = document.querySelector('.twoColsLayout-contentInner')
    contentInnerElement.classList.remove(styles['twoColsLayout-contentInner'])
  }

  render () {
    const {
      project,
      // phases,
      milestones,
      milestonesInApproval,
      onChangeMilestones,
      onSaveMilestone,
      onRemoveMilestone,
      onRemoveAllMilestones,
      onGetChallenges,
      onApproveMilestones,
      isProjectLive,
      isCustomer,
    } = this.props
    const onClickMilestonesTab = () => {}

    const isUpdatable =
      isCustomer ? project.status === PHASE_STATUS_IN_REVIEW
        : isProjectLive

    if (milestones.length === 0) {
      return isCustomer ? null : (
        <div styleName="add-new-milestone">
          <button
            className="tc-btn tc-btn-primary tc-btn-sm action-btn"
            onClick={() => {
              const newMilestone = milestoneHelper.createEmptyMilestone(new Date())
              newMilestone.edit = true
              onChangeMilestones([newMilestone])
            }}
          >
            Add New Milestone
          </button>
        </div>
      )
    }

    return (
      <div>
        {/* <ProjectDetailsWidget project={project} phases={phases} /> */}
        <div styleName="milestones-container">
          {!isCustomer && <MilestonesApprovalNotification milestones={milestones} />}
          <div styleName="tabs-header">
            <GenericMenu navLinks={createTabs(onClickMilestonesTab)} />
          </div>
          <ManageMilestones
            milestones={milestones}
            milestonesInApproval={milestonesInApproval}
            onGetChallenges={onGetChallenges}
            onChangeMilestones={onChangeMilestones}
            onSaveMilestone={onSaveMilestone}
            onRemoveMilestone={onRemoveMilestone}
            onRemoveAllMilestones={onRemoveAllMilestones}
            onApproveMilestones={onApproveMilestones}
            projectMembers={project.members}
            project={project}
            isUpdatable={isUpdatable}
            isCustomer={isCustomer}
          />
        </div>
      </div>
    )
  }
}

CreateSimplePlan.propTypes = {
  project: PT.shape(),
  phases: PT.arrayOf(PT.shape()),
  milestones: PT.arrayOf(PT.shape()),
  onChangeMilestones: PT.func,
  onSaveMilestone: PT.func,
  onRemoveMilestone: PT.func,
  onRemoveAllMilestones: PT.func,
  onGetChallenges: PT.func,
  onApproveMilestones: PT.func,
  isCustomer: PT.bool,
}

export default CreateSimplePlan
