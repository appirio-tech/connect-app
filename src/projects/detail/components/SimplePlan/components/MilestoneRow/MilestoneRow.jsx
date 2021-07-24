/**
 * View / edit milestone record
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import _ from 'lodash'
import { components } from 'react-select'
import { isValidStartEndDates } from '../../../../../../helpers/utils'
import FormsySelect from '../../../../../../components/Select/FormsySelect'
// import MilestoneCopilots from '../MilestoneCopilots'
import MilestoneStatus from '../MilestoneStatus'
import MilestoneBudget from '../MilestoneBudget'
import MilestoneDeleteButton from '../MilestoneDeleteButton'
import { PHASE_STATUS_OPTIONS } from '../../../../../../config/constants'
import IconCheck from '../../../../../../assets/icons/icon-check-thin.svg'
import IconXMark from '../../../../../../assets/icons/icon-x-mark-thin.svg'
import IconPencil from '../../../../../../assets/icons/icon-ui-pencil.svg'
import IconDots from '../../../../../../assets/icons/icon-dots.svg'
import IconArrowDown from '../../../../../../assets/icons/arrow-6px-carret-down-normal.svg'

import styles from './MilestoneRow.scss'

const TCFormFields = FormsyForm.Fields

function MilestoneRow({
  milestone,
  rowId,
  onChange,
  onSave,
  onRemove,
  onDiscard,
  projectMembers,
  allMilestones,
  isCreatingRow,
  isUpdatable,
  members,
}) {
  const phaseStatusOptions = PHASE_STATUS_OPTIONS
  const edit = milestone.edit
  const copilotIds = _.get(milestone, 'details.copilots', [])
  let copilots = copilotIds.map(userId => projectMembers.find(member => member.userId === userId)).filter(Boolean)

  if (copilots.length !== copilotIds.length) {
    const missingCopilotIds = _.difference(copilotIds, projectMembers.map(member => member.userId))
    const missingCopilots = missingCopilotIds.map(userId => members[userId])
    copilots = copilots.concat(missingCopilots)
  }

  let milestoneRef
  let startDateRef
  let endDateRef
  let budgetRef

  return edit ? (
    <tr styleName="milestone-row" className="edit-milestone-row">
      <td styleName="checkbox">
        <TCFormFields.Checkbox
          name={`select-${rowId}`}
          value={milestone.selected}
          onChange={(_, value) => {
            onChange({ ...milestone, selected: value })
          }}
        />
      </td>
      <td styleName="milestone">
        <TCFormFields.TextInput
          validations={{
            isRequired: true,
            checkDuplicatedTitles(values) {
              if (!milestone.editting) {
                return true
              }
              const existingTitles = allMilestones
                .filter(i => i.id !== milestone.id)
                .map(i => i.name.toLowerCase().trim())
              const inputtingTitle = values[`title-${rowId}`].toLowerCase().trim()
              return existingTitles.indexOf(inputtingTitle) === -1
            }
          }}
          validationError={'Please, enter name'}
          validationErrors={{
            checkDuplicatedTitles: 'Milestone name already exists'
          }}
          required
          type="text"
          name={`title-${rowId}`}
          value={milestone.name  || ''}
          maxLength={48}
          onChange={(_, value) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone }
            }
            onChange({...milestone, name: value, editting: true, editted: true })
          }}
          wrapperClass={styles.textInput}
          innerRef={ref => milestoneRef = ref}
          isPristine={() => !milestone.editted}
        />
      </td>
      <td styleName="description">
        <TCFormFields.Textarea
          name={`description-${rowId}`}
          value={milestone.description || ''}
          maxLength={255}
          onChange={(_, value) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            onChange({...milestone, description: value })
          }}
          wrapperClass={styles.textArea}
          autoResize={false}
          rows={1}
        />
      </td>
      <td styleName="start-date">
        <TCFormFields.TextInput
          validations={{
            isRequired: true,
            isValidStartEndDatesForRow(values) {
              return isValidStartEndDates({
                startDate: values[`startDate-${rowId}`],
                endDate: values[`endDate-${rowId}`],
              })
            }
          }}
          validationError={'Please, enter start date'}
          validationErrors={{
            isValidStartEndDatesForRow: 'Start date cannot be after end date'
          }}
          required
          type="date"
          name={`startDate-${rowId}`}
          value={moment(milestone.startDate).format('YYYY-MM-DD')}
          onChange={(_, value) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            onChange({...milestone, startDate: value })
          }}
          wrapperClass={`${styles.textInput} ${styles.dateInput}`}
          innerRef={ref => startDateRef = ref}
        />
      </td>
      <td styleName="end-date">
        <TCFormFields.TextInput
          validations={{
            isRequired: true,
            isValidStartEndDatesForRow(values) {
              return isValidStartEndDates({
                startDate: values[`startDate-${rowId}`],
                endDate: values[`endDate-${rowId}`],
              })
            }
          }}
          validationError={'Please, enter end date'}
          validationErrors={{
            isValidStartEndDatesForRow: 'End date cannot be before start date'
          }}
          required
          type="date"
          name={`endDate-${rowId}`}
          value={moment(milestone.endDate).format('YYYY-MM-DD')}
          onChange={(_, value) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            onChange({...milestone, endDate: value })
          }}
          wrapperClass={`${styles.textInput} ${styles.dateInput}`}
          innerRef={ref => endDateRef = ref}
        />
      </td>
      <td styleName="status">
        <FormsySelect
          name={`status-${rowId}`}
          options={phaseStatusOptions}
          onChange={(selectedOption) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            onChange({...milestone, status: selectedOption.value })
          }}
          value={phaseStatusOptions.find(option => option.value === milestone.status)}
          isSearchable={false}
          components={{
            DropdownIndicator: (props) => (
              <components.DropdownIndicator {...props}>
                <IconArrowDown />
              </components.DropdownIndicator>
            )
          }}
        />
      </td>
      <td styleName="budget">
        <span styleName="prefix-icon" className="milestone-budget-prefix-icon">$</span>
        <TCFormFields.TextInput
          validations={{
            isRequired: true,
            isPositive(values) {
              return !(values[`budget-${rowId}`] < 0)
            }
          }}
          validationError={'Please, enter budget'}
          validationErrors={{
            isPositive: 'Budget cannot be negative'
          }}
          required
          type="number"
          name={`budget-${rowId}`}
          value={milestone.budget || 0}
          onChange={(_, value) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            onChange({...milestone, budget: value })
          }}
          wrapperClass={styles.textInput}
          innerRef={ref => budgetRef = ref}
        />
      </td>
      {/* <td styleName="copilots">
        <MilestoneCopilots
          edit
          copilots={copilots}
          projectMembers={projectMembers}
          onAdd={(member) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            const details = milestone.details
            const copilotIdsUpdated = copilots.map(copilot => copilot.userId).concat(member.userId)
            onChange({...milestone, details: { ...details, copilots: copilotIdsUpdated } })
          }}
          onRemove={(member) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            const details = milestone.details
            const copilotIdsUpdated = copilots.filter(copilot => copilot.userId !== member.userId).map(copilot => copilot.userId)
            onChange({...milestone, details: { ...details, copilots: copilotIdsUpdated } })
          }}
        />
      </td> */}
      <td styleName="action">
        <div styleName="inline-menu">
          <button
            type="submit"
            className="tc-btn tc-btn-link"
            styleName="icon-button"
            onClick={() => {
              milestone.editted = true
              milestone.editting = true
              if (milestoneRef.props.isValid()
                && startDateRef.props.isValid()
                && endDateRef.props.isValid()
                && budgetRef.props.isValid()
              ) {
                onSave(milestone.id)
              }
            }}
          >
            <IconCheck />
          </button>
          <button
            type="button"
            className="tc-btn tc-btn-link"
            styleName="icon-button"
            onClick={() => {
              if (isCreatingRow) {
                onDiscard(milestone.id)
              } else {
                onChange({ ...(milestone.origin || milestone), edit: false })
              }
            }}
          >
            <IconXMark />
          </button>
        </div>
      </td>
    </tr>
  ) : (
    <tr styleName="milestone-row">
      <td styleName="checkbox">
        <TCFormFields.Checkbox
          name={`select-${rowId}`}
          value={milestone.selected}
          onChange={(_, value) => {
            onChange({ ...milestone, selected: value })
          }}
        />
      </td>
      <td styleName="milestone">
        {milestone.name}
      </td>
      <td styleName="description">
        {milestone.description}
      </td>
      <td styleName="start-date">
        {moment(milestone.startDate).format('MM-DD-YYYY')}
      </td>
      <td styleName="end-date">
        {moment(milestone.endDate).format('MM-DD-YYYY')}
      </td>
      <td styleName="status">
        <MilestoneStatus status={milestone.status} />
      </td>
      <td styleName="budget">
        <MilestoneBudget spent={milestone.spentBudget} budget={milestone.budget} />
      </td>
      {/* <td styleName="copilots">
        <MilestoneCopilots copilots={copilots} />
      </td> */}
      {isUpdatable && (
        <td styleName="action">
          <div styleName="inline-menu">
            <button
              type="button"
              className="tc-btn tc-btn-link"
              styleName="icon-button"
              onClick={() => {
                onChange({ ...milestone, edit: true })
              }}
            >
              <IconPencil />
            </button>
            <MilestoneDeleteButton
              onDelete={() => {
                onRemove(milestone.id)
              }}
            />
            <button type="button" className="tc-btn tc-btn-link" styleName="icon-button">
              <IconDots />
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}

MilestoneRow.propTypes = {
  milestone: PT.shape(),
  rowId: PT.string,
  onChange: PT.func,
  onSave: PT.func,
  onRemove: PT.func,
  onDiscard: PT.func,
  projectMembers: PT.arrayOf(PT.shape()),
  allMilestones: PT.arrayOf(PT.shape()),
  isCreatingRow: PT.bool,
  isUpdatable: PT.bool,
  members: PT.object,
}

export default MilestoneRow
