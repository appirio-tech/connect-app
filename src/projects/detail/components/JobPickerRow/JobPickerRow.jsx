import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import IconX from '../../../../assets/icons/ui-16px-1_bold-remove.svg'
import IconAdd from '../../../../assets/icons/ui-16px-1_bold-add.svg'
import SkillsQuestion from '../SkillsQuestion/SkillsQuestionBase'
import PositiveNumberInput from '../../../../components/PositiveNumberInput/PositiveNumberInput'
import SelectDropdown from 'appirio-tech-react-components/components/SelectDropdown/SelectDropdown'
import DescriptionField from '../DescriptionField'

import styles from './JobPickerRow.scss'

const always = () => true
const never = () => false
const emptyError = () => ''

const MAX_NUMBER = Math.pow(2, 31) - 1

class JobPickerRow extends React.PureComponent {
  constructor(props) {
    super(props)

    this.handlePeopleChange = this.handlePeopleChange.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
    this.handleSkillChange = this.handleSkillChange.bind(this)
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this)
    this.handleRoleChange = this.handleRoleChange.bind(this)
    this.handleWorkloadChange = this.handleWorkloadChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)

    this.resetPeople = this.resetPeople.bind(this)
    this.resetDuration = this.resetDuration.bind(this)

    this.onAddRow = this.onAddRow.bind(this)
    this.onDeleteRow = this.onDeleteRow.bind(this)

    this.workloadOptions = [
      { value: null, title: 'Select Workload'},
      { value: 'fulltime', title: 'Full-Time'},
      { value: 'fractional', title: 'Fractional'}
    ]

    this.roleOptions = [
      { value: null, title: 'Select Role'},
      { value: 'designer', title: 'Designer'},
      { value: 'software-developer', title: 'Software Developer'},
      { value: 'data-scientist', title: 'Data Scientist'},
      { value: 'data-engineer', title: 'Data Engineer'},
      { value: 'qa', title: 'QA Tester'},
      { value: 'qa-engineer', title: 'QA Engineer'}
    ]
  }
  handleJobTitleChange(evt) {
    this.props.onChange(this.props.rowIndex, 'title', evt.target.value)
  }
  handlePeopleChange(evt) {
    this.props.onChange(this.props.rowIndex, 'people', evt.target.value)
  }

  handleDurationChange(evt) {
    this.props.onChange(this.props.rowIndex, 'duration', evt.target.value)
  }

  handleSkillChange(value) {
    this.props.onChange(this.props.rowIndex, 'skills', value)
  }

  handleWorkloadChange(evt) {
    this.props.onChange(this.props.rowIndex, 'workLoad', evt)
  }

  handleRoleChange(evt) {
    this.props.onChange(this.props.rowIndex, 'role', evt)
  }

  handleDescriptionChange(value) {
    this.props.onChange(this.props.rowIndex, 'description', value)
  }

  resetDuration() {
    const { rowIndex, onChange, value } = this.props
    if (!value.duration) {
      onChange(rowIndex, 'duration', '0')
    }
  }

  resetPeople() {
    const { rowIndex, onChange, value } = this.props
    if (!value.people) {
      onChange(rowIndex, 'people', '0')
    }
  }

  onAddRow() {
    const { rowIndex, value, onAddRow: addRowHandler } = this.props
    addRowHandler(rowIndex + 1, value.role)
  }

  onDeleteRow() {
    const { rowIndex, onDeleteRow: deleteRowHandler } = this.props
    deleteRowHandler(rowIndex)
  }

  render() {
    const { value, rowIndex } = this.props
    const isRowIncomplete = value.title.trim().length > 0 || value.people > 0 || value.duration > 0 || (value.skills && value.skills.length)
      ||(value.role && value.role.value !== null) ||(value.workLoad && value.workLoad.value !== null) || (value.description.trim().length >  0)

    /* Different columns are defined here and used in componsing mobile/desktop views below */
    const titleColumn = (
      <div styleName="col col-role">
        <div styleName="col-job-name-container">
          <label className="tc-label" styleName="label">
            Job {rowIndex +1}
          </label>
          <input
            type="text"
            maxLength={100}
            value={value.title}
            className={cn('tc-file-field__inputs', { error: isRowIncomplete && !value.title.trim() })}
            name="title"
            maxLength="128"
            onChange={this.handleJobTitleChange}
            placeholder="Job Title"
          />
        </div>
      </div>
    )

    const actionsColumn = (
      <div styleName="col col-actions">
        <div styleName="d-flex col-actions-container">
          <div onClick={this.onAddRow} styleName="action-btn">
            <IconAdd />
          </div>
          { rowIndex > 0 && (
            <div onClick={this.onDeleteRow} styleName="action-btn action-btn-remove">
              <IconX />
            </div>
          )}
        </div>
      </div>
    )

    const peopleColumn = (
      <div styleName="col col-people">
        <label className="tc-label" styleName="label">
          Number Of People
        </label>
        <PositiveNumberInput
          styleName="noMargin"
          className={cn('tc-file-field__inputs', { error: isRowIncomplete && value.people <= 0 })}
          max={MAX_NUMBER}
          value={value.people || ''}
          onChange={this.handlePeopleChange}
          onBlur={this.resetPeople}
        />
      </div>
    )

    const durationColumn = (
      <div styleName="col col-duration">
        <label className="tc-label" styleName="label">
          Duration (weeks)
        </label>
        <PositiveNumberInput
          styleName="noMargin"
          className={cn('tc-file-field__inputs', {error: isRowIncomplete && value.duration <= 0 })}
          max={MAX_NUMBER}
          value={value.duration || ''}
          onChange={this.handleDurationChange}
          onBlur={this.resetDuration}
        />
      </div>
    )

    const skillSelectionColumn = (
      <div styleName="col col-skill-selection">
        <label className="tc-label" styleName="label">
          Skills
        </label>
        {/*
          Please do not refactor getValue prop's value to a binded function with constant reference.
          SkillsQuestion is a pure component. If all the props are constant across renders, SkillsQuestion cannot detect the change in value.skills.
          So, it'll break the functionality of the component.
          "getValue" prop is left as inline arrow function to trigger re rendering of the SkillsQuestion component whenever the parent rerenders.
        */}
        <SkillsQuestion
          disabled={false}
          isFormDisabled={never}
          skillsCategories={[]}
          isPristine={always}
          isValid={always}
          getErrorMessage={emptyError}
          setValue={this.handleSkillChange}
          getValue={() => value.skills}
          onChange={_.noop}
          selectWrapperClass={cn(styles.noMargin, {[styles.skillHasError]: isRowIncomplete && !(value.skills && value.skills.length)})}
        />
      </div>
    )

    const workLoadColumn = (
      <div styleName="col col-duration">
        <label className="tc-label" styleName="label">
          Workload
        </label>
        <SelectDropdown
          name="workLoad"
          value={value.workLoad ? value.workLoad.value : null}
          theme={`default ${isRowIncomplete && value.workLoad && value.workLoad.value === null ? 'error' : ''}`}
          options={ this.workloadOptions }
          onSelect={ this.handleWorkloadChange }
        />
      </div>
    )

    const roleColumn = (
      <div styleName="col col-duration">
        <label className="tc-label" styleName="label">
         Role
        </label>
        <SelectDropdown
          name="role"
          value={value.role ? value.role.value : null}
          theme={`default ${isRowIncomplete && value.role && value.role.value === null ? 'error' : ''}`}
          options={ this.roleOptions }
          onSelect={ this.handleRoleChange }
        />
      </div>
    )

    const descriptionColumn = (
      <div styleName="col col-skill-selection">
        <label className="tc-label" styleName="label">
          Job Description
        </label>
        <DescriptionField
          className={`${isRowIncomplete && !value.description.trim() ? 'error' : ''}`}
          valueChange={this.handleDescriptionChange}
          placeholder="Job Description"
          value={value.description || ''}
        />
      </div>
    )

    return (
      <div styleName="row">
        <div styleName="inner-row">
          {titleColumn}
          {actionsColumn}
        </div>

        <div styleName="inner-row">
          {peopleColumn}
          {roleColumn}
        </div>
        <div styleName="inner-row">
          {durationColumn}
          {workLoadColumn}
        </div>
        <div styleName="inner-row">
          {descriptionColumn}
        </div>

        <div styleName="inner-row">{skillSelectionColumn}</div>
      </div>
    )
  }
}

JobPickerRow.propTypes = {
  rowIndex: PT.number.isRequired,
  onChange: PT.func.isRequired,
  onAddRow: PT.func.isRequired,
  onDeleteRow: PT.func.isRequired,
  value: PT.shape({
    people: PT.string.isRequired,
    title: PT.string,
    duration: PT.string.isRequired,
    skills: PT.array,
  }),
}

JobPickerRow.defaultProps = {}

export default JobPickerRow
