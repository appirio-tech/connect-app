import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'
import cn from 'classnames'

import JobPickerRow from '../JobPickerRow/JobPickerRow.jsx'
import './JobsPickerQuestion.scss'
import { TAAS_MIN_JOB_DURATION } from '../../../../config/constants.js'

class JobsPickerQuestion extends Component {

  constructor(props) {
    super(props)

    this.getDefaultValue = this.getDefaultValue.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)

    this.insertJob = this.insertJob.bind(this)
    this.removeJob = this.removeJob.bind(this)
    this.setValidator(props)

    const { getValue } = props
    let values = getValue()
    if (values) {
      values = _.map(values, (v) => {
        return {
          ...v,
          // we need unique key for proper rendering of the component list
          _key: _.uniqueId('job_key_')
        }
      })
    }else {
      values = this.getDefaultValue()
    }

    this.state = {
      values
    }
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
          return v.title.trim().length  && v.people !== '0' && parseInt(v.duration, 10) >= TAAS_MIN_JOB_DURATION && v.skills.length > 0 && v.workLoad.value !== null && v.role.value !== null && v.description.trim().length
        }) // validation body
      },
      noPartialFillsExist: (formValues, value) => {
        return _.every(value, v => {
          const isAllValuesFilled = v.title.trim().length > 0 && v.people > 0 && v.duration >= TAAS_MIN_JOB_DURATION && v.skills && v.skills.length && v.description.trim().length && v.workLoad.value !== null && v.role.value !== null
          return isAllValuesFilled
        })
      }
    }
    setValidations(validations)
  }

  getDefaultValue() {
    return [{
      title: '',
      role: { value: null, title: 'Select Role'},
      people: '0',
      duration: '0',
      skills: [],
      workLoad: { value: null, title: 'Select Workload'},
      description: '',
      // we need unique key for proper rendering of the component list
      _key: _.uniqueId('job_key_')
    }]
  }

  onChange(values) {
    const {setValue, name} = this.props

    this.setState({values})
    // remove unique _key
    const newValues = _.map(values, (v) => {
      const cloneV = {...v}
      delete cloneV['_key']
      return cloneV
    })
    setValue(newValues)
    this.props.onChange(name, newValues)
  }

  handleValueChange(index, field, value) {
    let {values} = this.state
    const currentValue = values[index]
    currentValue[field] = value
    values = [...values.slice(0, index), {...currentValue}, ...values.slice(index + 1)]
    this.onChange(values)
  }

  insertJob(index) {
    let {values} = this.state

    values = [
      ...values.slice(0, index),
      ...this.getDefaultValue(),
      ...values.slice(index)
    ]
    this.onChange(values)
  }

  removeJob(index) {
    let {values} = this.state
    values = [...values.slice(0, index), ...values.slice(index + 1)]
    this.onChange(values)
  }

  render() {
    const { wrapperClass } = this.props
    const errorMessage =
      this.props.getErrorMessage() || this.props.validationError
    const hasError = !this.props.isPristine() && !this.props.isValid()

    const {values} = this.state

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
