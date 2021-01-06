import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'
import cn from 'classnames'

import JobPickerRow from '../JobPickerRow/JobPickerRow.jsx'
import './JobsPickerQuestion.scss'

class JobsPickerQuestion extends Component {

  constructor(props) {
    super(props)

    this.getDefaultValue = this.getDefaultValue.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)

    this.insertJob = this.insertJob.bind(this)
    this.removeJob = this.removeJob.bind(this)
    this.setValidator(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setValidator(nextProps)
  }

  setValidator(props) {
    const { setValidations, required } = props
    const validations = {
      oneRowHaveValidValue: (formValues, value) => {
        if (!required) {
          return true
        }
        return _.some(value, (v) => {
          return v.name.length  && v.people !== '0' && v.duration !== '0' && v.skills.length > 0 && v.workLoad.value !== null && v.role.value !== null && v.jobDescription.length
        }) // validation body
      },
      noPartialFillsExist: (formValues, value) => {
        return _.every(value, v => {

          const isOneValueFilled = v.name.length > 0 || v.people > 0 || v.duration > 0 || (v.skills && v.skills.length) || (v.jobDescription && v.jobDescription.length) || (v.workLoad && v.workLoad.value !== null) || (v.role && v.role.value !== null)
          const isAllValuesFilled = v.name.length > 0 && v.people > 0 && v.duration > 0 && v.skills && v.skills.length && v.jobDescription.length && v.workLoad.value !== null && v.role.value !== null
          // If one value is filled, all values should be filled to make this row valid. Partial fill is not valid
          const isRowValid = !isOneValueFilled || isAllValuesFilled
          return isRowValid
        })
      }
    }
    setValidations(validations)
  }

  getDefaultValue() {
    return [{
      name: '',
      role: { value: null, title: 'Select Role'},
      people: '0',
      duration: '0',
      skills: [],
      workLoad: { value: null, title: 'Select Workload'},
      jobDescription: '',
      _key: Date.now()
    }
    ]
  }

  onChange(value) {
    const {setValue, name} = this.props

    setValue(value)
    this.props.onChange(name, value)
  }

  handleValueChange(index, field, value) {
    const { getValue } = this.props
    let values = getValue() || this.getDefaultValue()
    values = [...values.slice(0, index), { ...values[index], [field]: value }, ...values.slice(index + 1)]

    this.onChange(values)
  }

  insertJob(index) {
    const { getValue } = this.props
    let values = getValue() || this.getDefaultValue()

    values = [
      ...values.slice(0, index),
      {
        name: '',
        role: { value: null, title: 'Select Role'},
        people: '0',
        duration: '0',
        skills: [],
        workLoad: { value: null, title: 'Select Workload'},
        jobDescription: '',
        _key: Date.now()
      },
      ...values.slice(index)
    ]
    this.onChange(values)
  }

  removeJob(index) {
    const { getValue } = this.props
    let values = getValue() || this.getDefaultValue()
    values = [...values.slice(0, index), ...values.slice(index + 1)]
    this.onChange(values)
  }

  render() {
    const { wrapperClass, getValue } = this.props
    const errorMessage =
      this.props.getErrorMessage() || this.props.validationError
    const hasError = !this.props.isPristine() && !this.props.isValid()

    const values = getValue() || this.getDefaultValue()

    return (
      <div className={cn(wrapperClass)}>
        <div styleName="container">
          {values.map((v, jobIndex) => {
            return (
              <JobPickerRow
                key={v._key}
                rowIndex={jobIndex}
                value={v}
                onChange={this.handleValueChange}
                onDeleteRow={this.removeJob}
                onAddRow={this.insertJob}
              />
            )
          })}
        </div>
        {hasError ? <p className="error-message">{errorMessage}</p> : null}
      </div>
    )
  }
}

JobsPickerQuestion.PropTypes = {
  onChange: PropTypes.func,
}

JobsPickerQuestion.defaultProps = {
  onChange: _.noop
}

export default hoc(JobsPickerQuestion)
