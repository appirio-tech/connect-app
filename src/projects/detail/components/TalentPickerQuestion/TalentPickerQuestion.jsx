import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'
import cn from 'classnames'

import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdownBase'
import IconX from '../../../../assets/icons/icon-x-mark.svg'
import IconAdd from '../../../../assets/icons/icon-ui-bold-add.svg'
import SkillsQuestion from '../SkillsQuestion/SkillsQuestionBase'

import './TalentPickerQuestion.scss'

class TalentPickerQuestion extends Component {

  constructor(props) {
    super(props)
    this.getDefaultValue = this.getDefaultValue.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.insertRole = this.insertRole.bind(this)
    this.removeRole = this.removeRole.bind(this)
    this.setValidator(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setValidator(nextProps)
  }

  setValidator(props) {
    const { setValidations } = props
    const validations = {
      oneRowHaveValidValue: (formValues, value) => {
        return _.some(value, (v) => {
          return v.people !== '0' && v.duration !== '0' && v.skills.length > 0
        }) // validation body
      },
    }
    setValidations(validations)
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

  handleValueChange(index, field, value) {
    const { getValue, setValue } = this.props
    const values = getValue() || this.getDefaultValue()
    values[index][field] = value

    setValue(values)
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
    const { wrapperClass, getValue, options } = this.props

    const errorMessage =
      this.props.getErrorMessage() || this.props.validationError
    const hasError = !this.props.isPristine() && !this.props.isValid()

    const values = getValue() || this.getDefaultValue()
    const peopleOptions = [
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
    const durationOptions = [
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
              {values.map((v, roleIndex) => {
                const roleSetting = _.find(options, { role: v.role })
                const roleTitle = roleSetting.roleTitle
                const skillsCategory = roleSetting.skillsCategory
                return (
                  <tr key={roleIndex}>
                    <td>{roleTitle}</td>
                    <td>
                      <SelectDropdown
                        options={peopleOptions}
                        value={v.people}
                        setValue={(e) => {
                          this.handleValueChange(roleIndex, 'people', e)
                        }}
                        theme="default"
                      />
                    </td>
                    <td>
                      <SelectDropdown
                        options={durationOptions}
                        value={v.duration}
                        setValue={(e) => {
                          this.handleValueChange(roleIndex, 'duration', e)
                        }}
                        theme="default"
                      />
                    </td>
                    <td styleName="skill-selection">
                      <SkillsQuestion
                        frequentSkills={[]}
                        disabled={false}
                        isFormDisabled={() => false}
                        skillsCategories={skillsCategory ? [skillsCategory] : null}
                        isPristine={() => true}
                        isValid={() => true}
                        getErrorMessage={() => ''}
                        setValue={(newValue) => {
                          this.handleValueChange(roleIndex, 'skills', newValue)
                        }}
                        getValue={() => {
                          return v.skills
                        }}
                        onChange={() => {}}
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
              })}
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
