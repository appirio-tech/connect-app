/**
 * Milestone header row
 */
import React from 'react'
import PT from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'

import './MilestoneHeaderRow.scss'

const TCFormFields = FormsyForm.Fields

function MilestoneHeaderRow ({ isEditingMilestone, milestones, onChangeMilestones, isUpdatable }) {
  const checked = milestones.reduce(
    (selected, milestone) => selected = selected && milestone.selected,
    milestones.length > 0
  )
  const selectAll = () => {
    const milestonesSelected = milestones.map(milestone => ({
      ...milestone,
      selected: true
    }))
    onChangeMilestones(milestonesSelected)
  }
  const unselectAll = () => {
    const milestonesUnselected = milestones.map(milestone => ({
      ...milestone,
      selected: false
    }))
    onChangeMilestones(milestonesUnselected)
  }

  return (
    <tr styleName="milestone-row">
      {isUpdatable ? <th />: null}
      {isEditingMilestone? <th /> :<th>
        <TCFormFields.Checkbox
          name="select-all"
          value={checked}
          onChange={(_, value) => {
            value ? selectAll() : unselectAll()
          }}
        />
      </th>}
      <th>MILESTONE</th>
      <th>DESCRIPTION</th>
      <th>START DATE</th>
      <th>END DATE</th>
      <th>STATUS</th>
      <th>COPILOTS</th>
      {isUpdatable && (<th>ACTION</th>)}
    </tr>
  )
}

MilestoneHeaderRow.propTypes = {
  onChangeMilestones: PT.func,
  isEditingMilestone: PT.bool,
}

export default MilestoneHeaderRow
