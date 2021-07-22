/**
 * Create simple project plan
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import GenericMenu from '../../../../../components/GenericMenu'
import ProjectDetailsWidget from '../ProjectDetailsWidget'
import ManageMilestones from '../ManageMilestones'
import * as milestoneHelper from '../components/helpers/milestone'

import styles from './CreateSimplePlan.scss'

const createTabs = ({ onClick } ) => ([
  {
    label: 'MILESTONES',
    isActive: true,
    onClick,
  }
])

class CreateSimplePlan extends React.Component {
  componentDidMount() {
    const { project, milestones, loadMembers } = this.props

    let copilotIds = []
    milestones.forEach((milestone) => {
      copilotIds = copilotIds.concat(_.get(milestone, 'details.copilots', []))
    })

    const projectMemberIds = project.members.map(member => member.userId)
    const missingMemberIds = _.difference(copilotIds, projectMemberIds)
    if (missingMemberIds.length) {
      loadMembers(missingMemberIds)
    }

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
      phases,
      milestones,
      onChangeMilestones,
      onSaveMilestone,
      onRemoveMilestone,
      isProjectLive,
      members,
      isCustomer,
    } = this.props
    const onClickMilestonesTab = () => {}

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
            isUpdatable={isProjectLive && !isCustomer}
            members={members}
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
  members: PT.object,
  isCustomer: PT.bool,
}

export default CreateSimplePlan
