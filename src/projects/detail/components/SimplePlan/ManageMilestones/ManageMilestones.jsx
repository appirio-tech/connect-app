/**
 * Manage milestones
 */
import React from 'react'
import PT from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import MilestoneRow from '../components/MilestoneRow'
import MilestoneChallengeHeader from '../components/MilestoneChallengeHeader'
import MilestoneChallengeRow from '../components/MilestoneChallengeRow'
import MilestoneChallengeFooter from '../components/MilestoneChallengeFooter'
import MilestoneHeaderRow from '../components/MilestoneHeaderRow'
import MilestoneDeleteButton from '../components/MilestoneDeleteButton'
import MilestoneCopilots from '../components/MilestoneCopilots'
import * as milestoneHelper from '../components/helpers/milestone'
import IconUnselect from '../../../../../assets/icons/icon-disselect.svg'
import IconCopilot from '../../../../../assets/icons/icon-copilot.svg'
import IconCalendar from '../../../../../assets/icons/calendar.svg'
// import IconGridView from '../../../../../assets/icons/ui-16px-2_grid-45-gray.svg'
// import IconGnattView from '../../../../../assets/icons/icon-gnatt-gray.svg'

import './ManageMilestones.scss'

const Formsy = FormsyForm.Formsy

class ManageMilestones extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expandList: []
    }
    this.onSave = this.onSave.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onDiscard = this.onDiscard.bind(this)
    this.onExpandChallenges = this.onExpandChallenges.bind(this)
    this.onUnselectAll = this.onUnselectAll.bind(this)
    this.onDeleteAll = this.onDeleteAll.bind(this)
    this.onAddCopilotAll = this.onAddCopilotAll.bind(this)
  }

  onAddCopilotAll(member, isAdd) {
    const { milestones, onSaveMilestone } = this.props
    const seletedMilestones = _.filter(milestones, m => m.selected)
    _.forEach(seletedMilestones, m => {
      if (!m.origin) {
        m.origin = {...m}
      }
      if (isAdd) {
        const isExist = _.find(m.members, o => o.userId === member.userId)
        if (!isExist) {
          // ignore
          m.members = [...m.members, member]
          this.onChange(m)
          onSaveMilestone(m.id)
        }
      } else {
        m.members = _.filter(m.members, o => o.userId !== member.userId)
        if (m.members.length !== m.origin.members.length) {
          this.onChange(m)
          onSaveMilestone(m.id)
        }
      }
    })
  }

  onDeleteAll() {
    const { milestones, onRemoveMilestone } = this.props
    const seletedMilestones = _.filter(milestones, m => m.selected)
    _.forEach(seletedMilestones, m => {
      onRemoveMilestone(m.id)
    })
  }

  onUnselectAll() {
    const { milestones, onChangeMilestones } = this.props
    const milestonesUnselected = milestones.map(milestone => ({
      ...milestone,
      selected: false
    }))
    onChangeMilestones(milestonesUnselected)
  }
  onExpandChallenges(isExpand, milestone) {
    let expandList = this.state.expandList
    const { onGetChallenges } = this.props

    let challengeIds = _.map(milestone.products, 'details.challengeId').slice(0, 6)
    challengeIds = _.filter(challengeIds)
    if (!challengeIds.length) {
      return
    }

    if (isExpand) {
      onGetChallenges(milestone.id, challengeIds)
      expandList.push(milestone.id)
      this.setState({expandList})
    } else {
      expandList = _.filter(expandList, e => milestone.id !== e)
      this.setState({expandList})
    }
  }

  onChange(updatedMilestone) {
    const { milestones, onChangeMilestones } = this.props
    const index = milestones.findIndex(m => m.id === updatedMilestone.id)

    const updatedMilestones = [...milestones]
    updatedMilestones.forEach(milestone => milestone.editting = false)
    updatedMilestones.splice(index, 1, updatedMilestone)
    onChangeMilestones(updatedMilestones)
  }

  onDiscard(id) {
    const { milestones, onChangeMilestones } = this.props
    const index = milestones.findIndex(m => m.id === id)

    const updatedMilestones = [...milestones]
    updatedMilestones.splice(index, 1)
    onChangeMilestones(updatedMilestones)
  }

  onAdd() {
    const { milestones, onChangeMilestones } = this.props
    const newMilestone = milestoneHelper.createEmptyMilestone(_.last(milestones).endDate)
    newMilestone.edit = true

    const updatedMilestones = [newMilestone, ...milestones]
    onChangeMilestones(updatedMilestones)
  }

  onSave(id) {
    const {onSaveMilestone} = this.props
    onSaveMilestone(id)
  }

  onRemove(id) {
    const {onRemoveMilestone} = this.props
    onRemoveMilestone(id)
  }

  isExpandChallengeList(milestone) {
    const isExpand = _.find(this.state.expandList, (i) => i === milestone.id)
    if (isExpand && milestone.challenges) {
      return true
    } else {
      return false
    }
  }

  renderChallengeTable(milestone) {
    if (!this.isExpandChallengeList(milestone)) {
      return <tr />
    }
    const rows = _.map(milestone.challenges, (c) => {
      return <MilestoneChallengeRow challenge={c}/>
    })
    return [
      <MilestoneChallengeHeader />,
      ...rows,
      <MilestoneChallengeFooter milestone={milestone}/>
    ]
  }
  getSelectCount() {
    const { milestones } = this.props
    const seletedMilestones = _.filter(milestones, m => m.selected)
    return seletedMilestones.length
  }

  renderAddCopilot() {
    const {
      projectMembers,
    } = this.props

    return (
      <MilestoneCopilots 
        edit 
        customButton={<IconCopilot />} 
        copilots={[]} 
        projectMembers={projectMembers} 
        onAdd={(member) => this.onAddCopilotAll(member, true)}  
        onRemove={(member) => this.onAddCopilotAll(member, false)}  
      />
    )
  }
  render() {
    const {
      milestones,
      projectMembers,
      onChangeMilestones,
      isUpdatable,
    } = this.props

    return (
      <div>
        <div styleName="toolbar">
          {/* <button className="tc-btn tc-btn-link" styleName="icon-button view-mode active">
            <IconGridView />
          </button>
          <button className="tc-btn tc-btn-link" styleName="icon-button view-mode">
            <IconGnattView />
          </button>
          <div styleName="separator" /> */}
          <div styleName="unselect-bottom" onClick={this.onUnselectAll}>
            <IconUnselect /> {this.getSelectCount()} PROJECTS SELECTED
          </div>
          <div styleName="delete-button">
            <MilestoneDeleteButton onDelete={this.onDeleteAll}/>
          </div>
          <div styleName="icon">
            {this.renderAddCopilot()}
          </div>
          <div styleName="icon">
            <IconCalendar />
          </div>
          {isUpdatable && (
            <button className="tc-btn tc-btn-primary tc-btn-sm" styleName="primary-button" onClick={this.onAdd}>
              ADD
            </button>
          )}
          {/* <button className="tc-btn tc-btn-primary tc-btn-sm" styleName="primary-button">
            IMPORT MILESTONES
          </button>
          <button className="tc-btn tc-btn-primary tc-btn-sm" styleName="primary-button">
            TEMPLATE
          </button> */}
        </div>
        <div styleName="table-container">
          <Formsy.Form>
            <table styleName="milestones-table">
              <colgroup>
                <col style={{ width: '20px' }} />{/* CHECKBOX */}
                <col style={{ width: '8%' }} />{/* MILESTONE */}
                <col />{/* DESCRIPTION */}
                <col style={{ width: '12%' }} />{/* START DATE */}
                <col style={{ width: '11%' }} />{/* END DATE */}
                <col style={{ width: '10%' }} />{/* STATUS */}
                <col style={{ width: '13%' }} />{/* COPILOTS */}
                {isUpdatable && (<col style={{ width: '64px' }} />)}{/* ACTION */}
              </colgroup>
              <thead>
                <MilestoneHeaderRow
                  milestones={milestones}
                  onChangeMilestones={onChangeMilestones}
                  isUpdatable={isUpdatable}
                />
              </thead>
              <tbody>
                {milestones.map((milestone) => (
                  [
                    <MilestoneRow
                      milestone={milestone}
                      key={milestone.id}
                      rowId={`${milestone.id}`}
                      isExpand={this.isExpandChallengeList(milestone)}
                      onExpand={this.onExpandChallenges}
                      onChange={this.onChange}
                      onSave={this.onSave}
                      onRemove={this.onRemove}
                      onDiscard={this.onDiscard}
                      projectMembers={projectMembers}
                      allMilestones={milestones}
                      isCreatingRow={`${milestone.id}`.startsWith('new-milestone')}
                      isUpdatable={isUpdatable}
                      phaseMembers={milestone.members}
                    />,
                    ...this.renderChallengeTable(milestone)
                  ]
                ))}
              </tbody>
            </table>
          </Formsy.Form>
        </div>
      </div>
    )
  }
}

ManageMilestones.propTypes = {
  milestones: PT.arrayOf(PT.shape()),
  onChangeMilestones: PT.func,
  onSaveMilestone: PT.func,
  onRemoveMilestone: PT.func,
  onGetChallenges: PT.func,
  projectMembers: PT.arrayOf(PT.shape()),
  isUpdatable: PT.bool,
}

export default ManageMilestones
