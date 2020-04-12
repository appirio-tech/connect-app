import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'
import cn from 'classnames'

import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdownBase'
import IconX from '../../../../assets/icons/icon-x-mark.svg'
import IconAdd from '../../../../assets/icons/icon-ui-bold-add.svg'
import SkillsQuestion from '../SkillsQuestion/SkillsQuestionBase'

import './TalentPickerQuestion.scss'

const always = () => true
const never = () => false
const emptyError = () => ''

class TalentPickerQuestion extends Component {

  constructor(props) {
    super(props)

    this.state = {
      options: []
    }

    this.peopleOptions = this.getPeopleOptions()
    this.durationOptions = this.getDurationOptions()

    this.getDefaultValue = this.getDefaultValue.bind(this)

    this.handlePeopleChange = this.handlePeopleChange.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
    this.handleSkillChange = this.handleSkillChange.bind(this)

    this.insertRole = this.insertRole.bind(this)
    this.removeRole = this.removeRole.bind(this)
    this.setValidator(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setValidator(nextProps)


    if (!_.isEqual(this.props.options, nextProps.options)) {
      this.updateOptions(nextProps)
    }
  }

  componentDidMount() {
    this.updateOptions(this.props)
  }

  setValidator(props) {
    const { setValidations, required } = props
    const validations = {
      oneRowHaveValidValue: (formValues, value) => {
        if (!required) {
          return true
        }
        return _.some(value, (v) => {
          return v.people !== '0' && v.duration !== '0' && v.skills.length > 0
        }) // validation body
      },
    }
    setValidations(validations)
  }

  updateOptions(props) {
    const options = props.options.map(o => ({...o, skillsCategories: o.skillsCategory ? [ o.skillsCategory ] : null}))
    this.setState({ options })
  }

  getDefaultValue() {
    const { options } = this.props
    return options.map((o) => ({
      role: o.role,
      people: '0',
      duration: '0',
      skills: [],
    }))
  }

  getPeopleOptions() {
    return [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '10+',
    ].map((v) => ({
      value: v,
      title: v,
    }))
  }

  getDurationOptions() {
    return [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ].map((v) => ({
      value: v,
      title: v,
      hide: v === '0',
    }))
  }

  handleValueChange(index, field, value) {
    const { getValue, setValue } = this.props
    const values = getValue() || this.getDefaultValue()
    values[index][field] = value

    setValue(values)
  }

  handlePeopleChange(value, index) {
    this.handleValueChange(index, 'people', value)
  }

  handleDurationChange(value, index) {
    this.handleValueChange(index, 'duration', value)
  }

  handleSkillChange(value, index) {
    this.handleValueChange(index, 'skills', value)
  }

  insertRole(index, role) {
    const { getValue, setValue } = this.props
    const values = getValue() || this.getDefaultValue()
    values.splice(index, 0, {
      role,
      people: '0',
      duration: '0',
      skills: [],
    })
    setValue(values)
  }

  removeRole(index) {
    const { getValue, setValue } = this.props
    const values = getValue() || this.getDefaultValue()
    values.splice(index, 1)
    setValue(values)
  }

  render() {
    const { wrapperClass, getValue } = this.props
    const { options } = this.state
    const { durationOptions, peopleOptions } = this

    const errorMessage =
      this.props.getErrorMessage() || this.props.validationError
    const hasError = !this.props.isPristine() && !this.props.isValid()

    const values = getValue() || this.getDefaultValue()

    const canDeleteRole = (role, index) =>
      _.findIndex(values, { role }) !== index
    return (
      <div className={cn(wrapperClass)}>
        <div styleName="container">
          <table styleName="table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Number of People Required</th>
                <th>Engagement Duration</th>
                <th>Skill Required</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {options.length > 0 ? values.map((v, roleIndex) => {
                const roleSetting = _.find(options, { role: v.role })
                const roleTitle = roleSetting.roleTitle
                const skillsCategories = roleSetting.skillsCategories
                return (
                  <tr key={roleIndex}>
                    <td>{roleTitle}</td>
                    <td>
                      <SelectDropdown
                        options={peopleOptions}
                        value={v.people}
                        setValue={this.handlePeopleChange}
                        theme="default"
                        identifier={roleIndex}
                      />
                    </td>
                    <td>
                      <SelectDropdown
                        options={durationOptions}
                        value={v.duration}
                        setValue={this.handleDurationChange}
                        theme="default"
                        identifier={roleIndex}
                      />
                    </td>
                    <td styleName="skill-selection">
                      <SkillsQuestion
                        disabled={false}
                        isFormDisabled={never}
                        skillsCategories={skillsCategories || null}
                        isPristine={always}
                        isValid={always}
                        getErrorMessage={emptyError}
                        identifier={roleIndex}
                        setValue={this.handleSkillChange}
                        currentValue={v.skills}
                        onChange={_.noop}
                      />
                    </td>
                    <td>
                      <div styleName="d-flex">
                        <div
                          onClick={() => {
                            this.insertRole(roleIndex + 1, v.role)
                          }}
                          styleName="btn"
                        >
                          <IconAdd />
                        </div>
                        {canDeleteRole(v.role, roleIndex) && (
                          <div
                            onClick={() => {
                              this.removeRole(roleIndex)
                            }}
                            styleName="btn"
                          >
                            <IconX />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              }) : null}
            </tbody>
          </table>
        </div>
        {hasError ? <p className="error-message">{errorMessage}</p> : null}
      </div>
    )
  }
}

TalentPickerQuestion.PropTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      skillsCategory: PropTypes.string.isRequired,
      roleTitle: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
}

TalentPickerQuestion.defaultProps = {}

export default hoc(TalentPickerQuestion)
