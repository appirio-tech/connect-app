/**
 * Manage milestones
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import MilestoneRow from '../components/MilestoneRow'
import MilestoneHeaderRow from '../components/MilestoneHeaderRow'
import * as constants from '../../../../../config/constants'
import IconGridView from '../../../../../assets/icons/ui-16px-2_grid-45-gray.svg'
import IconGnattView from '../../../../../assets/icons/icon-gnatt-gray.svg'

import './ManageMilestones.scss'

const Formsy = FormsyForm.Formsy

let nextId = 0

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
    const newMilestone = {
      id: `new-milestone-${nextId++}`,
      name: '',
      description: '',
      startDate: moment(_.last(milestones).endDate).format('YYYY-MM-DD'),
      endDate: moment(_.last(milestones).endDate).add(3, 'days').format('YYYY-MM-DD'),
      status: constants.PHASE_STATUS_DRAFT,
      budget: 0,
      edit: true,
    }

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
    const { milestones, projectMembers, onChangeMilestones, isProjectLive } = this.props

    return (
      <div>
        <div styleName="toolbar">
          <button className="tc-btn tc-btn-link" styleName="icon-button view-mode active">
            <IconGridView />
          </button>
          <button className="tc-btn tc-btn-link" styleName="icon-button view-mode">
            <IconGnattView />
          </button>
          <div styleName="separator" />
          {isProjectLive && (
            <button className="tc-btn tc-btn-primary tc-btn-sm" styleName="primary-button" onClick={this.onAdd}>
              ADD
            </button>
          )}
          <button className="tc-btn tc-btn-primary tc-btn-sm" styleName="primary-button">
            IMPORT MILESTONES
          </button>
          <button className="tc-btn tc-btn-primary tc-btn-sm" styleName="primary-button">
            TEMPLATE
          </button>
        </div>
        <div styleName="table-container">
          <Formsy.Form>
            <table styleName="milestones-table">
              <colgroup>
                <col style={{width: '20px'}} />                               {/* CHECKBOX */}
                <col style={{width: '10%'}} />                                {/* MILESTONE */}
                <col style={{minWidth: '140px'}} />                           {/* DESCRIPTION */}
                <col style={{width: '10%', minWidth: '80px'}} />              {/* START DATE */}
                <col style={{width: '10%', minWidth: '80px'}} />              {/* END DATE */}
                <col style={{width: '10%'}} />                                {/* STATUS */}
                <col style={{width: '15%'}} />                                {/* BUDGET */}
                <col style={{width: '10%'}} />                                {/* COPILOTS */}
                <col style={{width: '80px'}} />                               {/* ACTION */}
              </colgroup>
              <thead>
                <MilestoneHeaderRow milestones={milestones} onChangeMilestones={onChangeMilestones} />
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
                    isProjectLive={isProjectLive}
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
}

export default ManageMilestones
