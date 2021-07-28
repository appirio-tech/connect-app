/**
 * Manage milestones
 */
import React from 'react'
import PT from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import MilestoneRow from '../components/MilestoneRow'
import MilestoneHeaderRow from '../components/MilestoneHeaderRow'
import * as milestoneHelper from '../components/helpers/milestone'
// import IconGridView from '../../../../../assets/icons/ui-16px-2_grid-45-gray.svg'
// import IconGnattView from '../../../../../assets/icons/icon-gnatt-gray.svg'

import './ManageMilestones.scss'

const Formsy = FormsyForm.Formsy

class ManageMilestones extends React.Component {
  constructor(props) {
    super(props)

    this.onSave = this.onSave.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onDiscard = this.onDiscard.bind(this)
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

  render() {
    const {
      milestones,
      projectMembers,
      onChangeMilestones,
      isUpdatable,
      members,
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
                <col style={{ width: '12%' }} />{/* BUDGET */}
                {/* <col style={{ width: '13%' }} /> */}{/* COPILOTS */}
                {isUpdatable && (<col style={{ width: '80px' }} />)}{/* ACTION */}
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
                  <MilestoneRow
                    milestone={milestone}
                    key={milestone.id}
                    rowId={`${milestone.id}`}
                    onChange={this.onChange}
                    onSave={this.onSave}
                    onRemove={this.onRemove}
                    onDiscard={this.onDiscard}
                    projectMembers={projectMembers}
                    allMilestones={milestones}
                    isCreatingRow={`${milestone.id}`.startsWith('new-milestone')}
                    isUpdatable={isUpdatable}
                    members={members}
                    phaseMembers={milestone.members}
                  />
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
  projectMembers: PT.arrayOf(PT.shape()),
  members: PT.object,
  isUpdatable: PT.bool,
}

export default ManageMilestones
