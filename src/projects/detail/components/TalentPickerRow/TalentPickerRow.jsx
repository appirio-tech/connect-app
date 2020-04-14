import React from 'react'
import PT from 'prop-types'

import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdownBase'
import IconX from '../../../../assets/icons/icon-x-mark.svg'
import IconAdd from '../../../../assets/icons/icon-ui-bold-add.svg'
import SkillsQuestion from '../SkillsQuestion/SkillsQuestionBase'

import './TalentPickerRow.scss'

const always = () => true
const never = () => false
const emptyError = () => ''

class TalentPickerRow extends React.PureComponent {
  constructor(props) {
    super(props)

    this.peopleOptions = this.getPeopleOptions()
    this.durationOptions = this.getDurationOptions()

    this.handlePeopleChange = this.handlePeopleChange.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
    this.handleSkillChange = this.handleSkillChange.bind(this)

    this.onAddRow = this.onAddRow.bind(this)
    this.onDeleteRow = this.onDeleteRow.bind(this)
  }

  handlePeopleChange(value) {
    this.props.onChange(this.props.rowIndex, 'people', value)
  }

  handleDurationChange(value) {
    this.props.onChange(this.props.rowIndex, 'duration', value)
  }

  handleSkillChange(value) {
    this.props.onChange(this.props.rowIndex, 'skills', value)
  }

  onAddRow() {
    const { rowIndex, value, onAddRow: addRowHandler } = this.props
    addRowHandler(rowIndex + 1, value.role)
  }

  onDeleteRow() {
    const { rowIndex, onDeleteRow: deleteRowHandler } = this.props
    deleteRowHandler(rowIndex)
  }

  getPeopleOptions() {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'].map((v) => ({
      value: v,
      title: v,
    }))
  }

  getDurationOptions() {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((v) => ({
      value: v,
      title: v,
      hide: v === '0',
    }))
  }

  render() {
    const { value, canBeDeleted, roleSetting } = this.props

    return (
      <tr>
        <td>{roleSetting.roleTitle}</td>
        <td>
          <SelectDropdown options={this.peopleOptions} value={value.people} setValue={this.handlePeopleChange} theme="default" />
        </td>
        <td>
          <SelectDropdown options={this.durationOptions} value={value.duration} setValue={this.handleDurationChange} theme="default" />
        </td>
        <td styleName="skill-selection">
          <SkillsQuestion
            disabled={false}
            isFormDisabled={never}
            skillsCategories={roleSetting.skillsCategories}
            isPristine={always}
            isValid={always}
            getErrorMessage={emptyError}
            setValue={this.handleSkillChange}
            currentValue={value.skills}
            onChange={_.noop}
          />
        </td>
        <td>
          <div styleName="d-flex">
            <div onClick={this.onAddRow} styleName="btn">
              <IconAdd />
            </div>
            {canBeDeleted && (
              <div onClick={this.onDeleteRow} styleName="btn">
                <IconX />
              </div>
            )}
          </div>
        </td>
      </tr>
    )
  }
}

TalentPickerRow.propTypes = {
  rowIndex: PT.number.isRequired,
  canBeDeleted: PT.bool.isRequired,
  onChange: PT.func.isRequired,
  onAddRow: PT.func.isRequired,
  onDeleteRow: PT.func.isRequired,
  roleSetting: PT.shape({
    roleTitle: PT.string.isRequired,
    skillsCategories: PT.arrayOf(PT.string)
  }).isRequired,
  value: PT.shape({
    role: PT.string.isRequired,
    people: PT.string.isRequired,
    duration: PT.string.isRequired,
    skills: PT.array
  }),
}

TalentPickerRow.defaultProps = {}

export default TalentPickerRow
