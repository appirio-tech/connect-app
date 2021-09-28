/**
 * View / edit milestone record
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import { components } from 'react-select'
import { isValidStartEndDates } from '../../../../../../helpers/utils'
import FormsySelect from '../../../../../../components/Select/FormsySelect'
import MilestoneCopilots from '../MilestoneCopilots'
import MilestoneStatus from '../MilestoneStatus'
import MilestoneDeleteButton from '../MilestoneDeleteButton'
import { PHASE_STATUS_IN_REVIEW, PHASE_STATUS_OPTIONS } from '../../../../../../config/constants'
import IconApprove from '../../../../../../assets/icons/icon-ui-approve.svg'
import IconReject from '../../../../../../assets/icons/icon-ui-reject.svg'
import IconCheck from '../../../../../../assets/icons/icon-save2.svg'
import IconXMark from '../../../../../../assets/icons/icon-delete.svg'
import IconPencil from '../../../../../../assets/icons/icon-ui-pencil.svg'
import IconDots from '../../../../../../assets/icons/icon-dots.svg'
import IconArrowDown from '../../../../../../assets/icons/arrow-6px-carret-down-normal.svg'
import IconExpand from '../../../../../../assets/icons/arrows-16px-1_minimal-right.svg'
import IconClose from '../../../../../../assets/icons/arrows-16px-1_minimal-down.svg'

import styles from './MilestoneRow.scss'
import MilestoneApprovalButton from '../MilestoneApprovalButton'

const TCFormFields = FormsyForm.Fields

function MilestoneRow({
  isExpand,
  isEditingMilestone,
  milestone,
  rowId,
  onExpand,
  onChange,
  onSave,
  onRemove,
  onDiscard,
  onApprove,
  projectMembers,
  allMilestones,
  isCreatingRow,
  isUpdatable,
  phaseMembers,
  disableDeleteAction,
  isCustomer,
  isApproving,
  hideCheckbox,
  isInReview
}) {
  const isNeedApproval = milestone.status === PHASE_STATUS_IN_REVIEW
  const showApproval = isCustomer && isNeedApproval

  const phaseStatusOptions = PHASE_STATUS_OPTIONS
  const edit = milestone.edit
  // hide email
  const copilots = (phaseMembers || []).map(member => ({ ...member, email: undefined }))

  let milestoneRef
  let startDateRef
  let endDateRef
  const tdEl = hideCheckbox ? null : <td/>

  return edit ? (
    <tr styleName="milestone-row" className="edit-milestone-row">
      {isUpdatable ? <td /> : null}
      {(isEditingMilestone || hideCheckbox) ? <td/ >: <td styleName="checkbox">
        <TCFormFields.Checkbox
          name={`select-${rowId}`}
          value={milestone.selected}
          onChange={(_, value) => {
            onChange({ ...milestone, selected: value })
          }}
        />
      </td>}
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
      <td styleName="copilots">
        <MilestoneCopilots
          edit
          copilots={copilots}
          projectMembers={projectMembers}
          onAdd={(member) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            const copilotsUpdated = copilots
              .concat(member)
            onChange({...milestone, members: copilotsUpdated })
          }}
          onRemove={(member) => {
            if (!milestone.origin) {
              milestone.origin = {...milestone}
            }
            const copilotsUpdated = copilots
              .filter(copilot => copilot.userId !== member.userId)
            onChange({...milestone, members: copilotsUpdated })
          }}
        />
      </td>
      {
        showApproval ? <td styleName="action">
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
                ) {
                  onSave(milestone.id)
                }
              }}
            >
              <IconApprove />
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
              <IconReject />
            </button>
          </div>
        </td> :
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
      }

    </tr>
  ) : (
    <tr styleName="milestone-row">
      {isUpdatable ? <td styleName="expand" onClick={() => onExpand(!isExpand, milestone)}>{isExpand ? <IconClose />: <IconExpand />}</td>: <td />}
      {(isEditingMilestone || hideCheckbox) ? tdEl : <td styleName="checkbox">
        <TCFormFields.Checkbox
          name={`select-${rowId}`}
          value={milestone.selected}
          onChange={(_, value) => {
            onChange({ ...milestone, selected: value })
          }}
        />
      </td>}
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
      <td styleName="copilots">
        <MilestoneCopilots copilots={copilots} />
      </td>
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
              disabled={disableDeleteAction}
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
      {
        (isCustomer && isInReview) && (
          <td styleName="action">
            <div styleName="inline-menu approve">
              {
                showApproval && 
                <MilestoneApprovalButton 
                  type={'approve'}
                  disabled={isApproving}
                  onClick={() => {
                    onApprove({type: 'approve', item: milestone})
                  }}
                />
              }
              { 
                showApproval && 
                <MilestoneApprovalButton 
                  type="reject"
                  disabled={isApproving}
                  onClick={(v) => {
                    onApprove({type: 'reject', comment: v, item: milestone})
                  }}
                />
              }
            </div>
          </td>
        )
      }
    </tr>
  )
}

MilestoneRow.propTypes = {
  milestone: PT.shape(),
  isEditingMilestone: PT.bool,
  rowId: PT.string,
  onChange: PT.func,
  onSave: PT.func,
  onRemove: PT.func,
  onDiscard: PT.func,
  onExpand: PT.func,
  isExpand: PT.bool,
  projectMembers: PT.arrayOf(PT.shape()),
  allMilestones: PT.arrayOf(PT.shape()),
  isCreatingRow: PT.bool,
  isUpdatable: PT.bool,
  disableDeleteAction: PT.bool,
  isCustomer: PT.bool,
  members: PT.object,
  hideCheckbox: PT.bool,
  isInReview: PT.bool,
}

export default MilestoneRow
