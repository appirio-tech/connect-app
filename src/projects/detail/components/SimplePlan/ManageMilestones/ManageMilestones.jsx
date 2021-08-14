/**
 * Manage milestones
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import MilestoneRow from '../components/MilestoneRow'
import MilestoneChallengeHeader from '../components/MilestoneChallengeHeader'
import MilestoneChallengeRow from '../components/MilestoneChallengeRow'
import MilestoneChallengeFooter from '../components/MilestoneChallengeFooter'
import MilestoneHeaderRow from '../components/MilestoneHeaderRow'
import MilestoneDeleteButton from '../components/MilestoneDeleteButton'
import MilestoneCopilots from '../components/MilestoneCopilots'
import MilestoneMoveDateButton from '../components/MilestoneMoveDateButton'

import * as milestoneHelper from '../components/helpers/milestone'
import IconUnselect from '../../../../../assets/icons/icon-disselect.svg'
import IconCopilot from '../../../../../assets/icons/icon-copilot.svg'
import { CHALLENGE_ID_MAPPING, PHASE_STATUS_IN_REVIEW } from '../../../../../config/constants'

import './ManageMilestones.scss'
import MilestoneApprovalButton from '../components/MilestoneApprovalButton'

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
    this.onMoveMilestoneDates = this.onMoveMilestoneDates.bind(this)
    this.onLoadChallengesByPage = this.onLoadChallengesByPage.bind(this)
    this.onApprove = this.onApprove.bind(this)
  }
  onMoveMilestoneDates(days) {
    const {
      milestones,
      onSaveMilestone
    } = this.props

    
    if (days > 0) {
      const seletedMilestones = _.filter(milestones, m => m.selected && !m.edit)
      _.forEach(seletedMilestones, m => {
        m.startDate = moment(m.startDate).add(days, 'days')
        m.endDate = moment(m.endDate).add(days, 'days')
        this.onChange(m)
        onSaveMilestone(m.id)
      })
    }
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

  onLoadChallengesByPage(index, milestone) {
    const { onGetChallenges } = this.props
    let challengeIds = _.map(milestone.products, `details.${CHALLENGE_ID_MAPPING}`).slice(6 * index, 7 * (index+1))
    challengeIds = _.filter(challengeIds)
    if (!challengeIds.length) {
      return
    }
    onGetChallenges(milestone.id, challengeIds)
  }
  onExpandChallenges(isExpand, milestone) {
    let expandList = this.state.expandList
    const { onGetChallenges } = this.props

    const challengeIds = _.filter(_.map(milestone.products, `details.${CHALLENGE_ID_MAPPING}`)).slice(0, 6)

    if (isExpand) {
      if (challengeIds.length) {
        onGetChallenges(milestone.id, challengeIds)
      }
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
  
  onApprove({type, comment, item}) {
    const { milestones, onApproveMilestones } = this.props  
    if(item) {
      onApproveMilestones({type, comment, milestones: [item]})
      return
    }
    
    const updatedMilestones = [...milestones].filter( x => x.selected && x.status === PHASE_STATUS_IN_REVIEW)
    console.log('need updated milestones', milestones, updatedMilestones)
    onApproveMilestones({type, comment, milestones: updatedMilestones} )
  }

  isExpandChallengeList(milestone) {
    const isExpand = _.find(this.state.expandList, (i) => i === milestone.id)
    if (isExpand) {
      return true
    } else {
      return false
    }
  }

  renderChallengeTable(milestone) {
    const {
      isUpdatable
    } = this.props
    if (!isUpdatable ||!this.isExpandChallengeList(milestone)) {
      return <tr />
    }

    let challengeIds = _.map(milestone.products, `details.${CHALLENGE_ID_MAPPING}`).slice(0, 6)
    challengeIds = _.filter(challengeIds)
    // no challenges
    if (!challengeIds.length) {
      return [
        <MilestoneChallengeHeader key="header" isUpdatable={isUpdatable}/>,
        <MilestoneChallengeRow isEmpty key="row" isUpdatable={isUpdatable}/>
      ]
    }

    // loading challenges
    if (milestone.isLoadingChallenges) {
      return [
        <MilestoneChallengeHeader key="header" isUpdatable={isUpdatable}/>,
        <MilestoneChallengeRow isLoading key="row" isUpdatable={isUpdatable}/>,
        <MilestoneChallengeFooter isLoading key="footer" onLoadChallengesByPage={this.onLoadChallengesByPage} isUpdatable={isUpdatable}/>
      ]
    }

    const rows = _.map(milestone.challenges, (c) => {
      return <MilestoneChallengeRow key={c.id} challenge={c} isUpdatable={isUpdatable}/>
    })
    return [
      <MilestoneChallengeHeader key="header" isUpdatable={isUpdatable}/>,
      ...rows,
      <MilestoneChallengeFooter milestone={milestone} key="footer" onLoadChallengesByPage={this.onLoadChallengesByPage} isUpdatable={isUpdatable}/>
    ]
  }
  getSelectCount() {
    const { milestones } = this.props
    const seletedMilestones = _.filter(milestones, m => m.selected && !m.edit)
    return seletedMilestones.length
  }

  renderAddCopilot() {
    const {
      projectMembers,
      milestones,
    } = this.props

    const seletedMilestones = _.filter(milestones, m => m.selected)
    const copilots = _.intersectionBy(..._.map(seletedMilestones, 'members'), 'userId')
    return (
      <MilestoneCopilots 
        edit 
        customButton={<IconCopilot styleName="copilot-icon"/>} 
        copilots={copilots} 
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
      isCustomer,
    } = this.props

    // const isNeedApproval = project.status === PROJECT_STATUS_IN_REVIEW
    const isNeedApproval = !milestones.filter(ms => ms.selected === true).find(ms => !(ms.status === PHASE_STATUS_IN_REVIEW))
    const canShowApproval = isCustomer && isNeedApproval

    const canEdit = (isUpdatable || canShowApproval) && this.getSelectCount() > 0
    const canShowSelectionStatus = canEdit || (isCustomer && this.getSelectCount() > 0)

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
          {this.getSelectCount() > 0 ? <div styleName="unselect-bottom" onClick={this.onUnselectAll}>
            <IconUnselect /> {this.getSelectCount()} PROJECT(S) SELECTED
          </div>: null }
          { canEdit ? (() => canShowApproval ? 
            [
              <div styleName="hs" key={0}> </div>,
              <div styleName="approve-button">
                <MilestoneApprovalButton key={1} type="approve" 
                  global
                  title={'APPROVE'}
                  onClick={() => {this.onApprove({type: 'approve'})}}
                />
              </div>,
              <MilestoneApprovalButton key={2} type="reject" 
                global
                title={'REJECT'}
                onClick={(v) => this.onApprove({type: 'reject', comment: v})}
              />
            ] :
            [
              <div styleName="line" key={0}/>,
              <div styleName="delete-button" key={1}>
                <MilestoneDeleteButton onDelete={this.onDeleteAll}/>
              </div>,
              <div styleName="icon" key={2}>
                {this.renderAddCopilot()}
              </div>,
              <MilestoneMoveDateButton onMove={this.onMoveMilestoneDates} key={3}/>
            ])() : null}

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
              <thead>
                <MilestoneHeaderRow
                  milestones={milestones}
                  onChangeMilestones={onChangeMilestones}
                  isUpdatable={isUpdatable || isCustomer}
                />
              </thead>
              <tbody>
                {milestones.map((milestone, key) => (
                  [
                    <MilestoneRow
                      isEditingMilestone={!!milestone.edit}
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
                      isCustomer={isCustomer}
                      onApprove={this.onApprove}
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
  onApproveMilestones: PT.func,
  projectMembers: PT.arrayOf(PT.shape()),
  isUpdatable: PT.bool,
  isCustomer: PT.bool,
  project: PT.shape()
}

export default ManageMilestones
