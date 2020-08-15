import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import IconX from '../../../../assets/icons/ui-16px-1_bold-remove.svg'
import IconAdd from '../../../../assets/icons/ui-16px-1_bold-add.svg'
import SkillsQuestion from '../SkillsQuestion/SkillsQuestionBase'
import PositiveNumberInput from '../../../../components/PositiveNumberInput/PositiveNumberInput'
import ProductTypeIcon from '../../../../components/ProductTypeIcon'
import SelectDropdown from 'appirio-tech-react-components/components/SelectDropdown/SelectDropdown'

import styles from './TalentPickerRow.scss'

const always = () => true
const never = () => false
const emptyError = () => ''

class TalentPickerRow extends React.PureComponent {
  constructor(props) {
    super(props)

    this.handlePeopleChange = this.handlePeopleChange.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
    this.handleSkillChange = this.handleSkillChange.bind(this)
    this.handleWorkloadChange = this.handleWorkloadChange.bind(this)
    this.handleJobDescriptionChange = this.handleJobDescriptionChange.bind(this)
    this.handleAdditionalSkillChange = this.handleAdditionalSkillChange.bind(this)

    this.resetPeople = this.resetPeople.bind(this)
    this.resetDuration = this.resetDuration.bind(this)

    this.onAddRow = this.onAddRow.bind(this)
    this.onDeleteRow = this.onDeleteRow.bind(this)

    this.workloadOptions = [
      { value: null, title: 'Select Workload'},
      { value: 'fulltime', title: 'Full-Time'},
      { value: 'fractional', title: 'Fractional'}
    ]
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

  handleJobDescriptionChange(evt) {
    this.props.onChange(this.props.rowIndex, 'jobDescription', evt.target.value)
  }

  handleAdditionalSkillChange(value) {
    this.props.onChange(this.props.rowIndex, 'additionalSkills', value)
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
    const { value, canBeDeleted, roleSetting, rowIndex, talentPickerVersion } = this.props
    const isRowIncomplete = value.people > 0 || value.duration > 0 || (value.skills && value.skills.length)
      || (value.workLoad && value.workLoad.value !== null) || (value.jobDescription && value.jobDescription.trim() !== '')

    /* Different columns are defined here and used in componsing mobile/desktop views below */
    const roleColumn = (
      <div styleName="col col-role">
        <div styleName="col-role-container">
          <ProductTypeIcon type={roleSetting.icon} />
          <div styleName="role-text">{roleSetting.roleTitle}</div>
        </div>
      </div>
    )

    const actionsColumn = (
      <div styleName="col col-actions">
        <div styleName="d-flex col-actions-container">
          <div onClick={this.onAddRow} styleName="action-btn">
            <IconAdd />
          </div>
          {canBeDeleted(value.role, rowIndex) && (
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
          max={10000}
          value={value.people || ''}
          onChange={this.handlePeopleChange}
          onBlur={this.resetPeople}
        />
      </div>
    )

    const durationColumn = (
      <div styleName="col col-duration">
        <label className="tc-label" styleName="label">
          Duration (months)
        </label>
        <PositiveNumberInput
          styleName="noMargin"
          className={cn('tc-file-field__inputs', {error: isRowIncomplete && value.duration <= 0 })}
          max={10000}
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
          skillsCategories={roleSetting.skillsCategories}
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

    const jobDescriptionColumn = (
      <div styleName="col col-duration">
        <label className="tc-label" styleName="label">
          Job Description
        </label>
        <div styleName="job-description">
          <input
            className={`TextInput ${isRowIncomplete && !value.jobDescription ? 'error' : 'empty'}`}
            maxLength={100}
            onChange={this.handleJobDescriptionChange}
            placeholder="Job Description"
            type="text"
            value={value.jobDescription || ''}
          />
        </div>
      </div>
    )

    const additionalSkillSelectionColumn = (
      <div styleName="col col-skill-selection">
        <label className="tc-label" styleName="label">
          Preferred/Good-to-Have Skills
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
          skillsCategories={roleSetting.skillsCategories}
          isPristine={always}
          isValid={always}
          getErrorMessage={emptyError}
          setValue={this.handleAdditionalSkillChange}
          getValue={() => value.additionalSkills}
          onChange={_.noop}
          selectWrapperClass={cn(styles.noMargin)}
        />
      </div>
    )

    const talentPickerV2Layout = (
      <div styleName="row">
        <div styleName="inner-row">
          {roleColumn}
          {actionsColumn}
        </div>

        <div styleName="inner-row">
          {peopleColumn}
          {workLoadColumn}
        </div>
        <div styleName="inner-row">
          {durationColumn}
          {jobDescriptionColumn}
        </div>

        <div styleName="inner-row">{skillSelectionColumn}</div>
        <div styleName="inner-row">{additionalSkillSelectionColumn}</div>
      </div>
    )

    const talentPickerDefaultLayout = (
      <div styleName="row">
        <div styleName="inner-row">
          {roleColumn}
          {actionsColumn}
        </div>

        <div styleName="inner-row">
          {peopleColumn}
          {durationColumn}
        </div>

        <div styleName="inner-row">{skillSelectionColumn}</div>
      </div>
    )

    return (
      (talentPickerVersion && talentPickerVersion === 'v2.0' ? talentPickerV2Layout : talentPickerDefaultLayout)
    )
  }
}

TalentPickerRow.propTypes = {
  rowIndex: PT.number.isRequired,
  canBeDeleted: PT.func.isRequired,
  onChange: PT.func.isRequired,
  onAddRow: PT.func.isRequired,
  onDeleteRow: PT.func.isRequired,
  roleSetting: PT.shape({
    roleTitle: PT.string.isRequired,
    skillsCategories: PT.arrayOf(PT.string),
  }).isRequired,
  value: PT.shape({
    role: PT.string.isRequired,
    people: PT.string.isRequired,
    duration: PT.string.isRequired,
    skills: PT.array,
  }),
}

TalentPickerRow.defaultProps = {}

export default TalentPickerRow
