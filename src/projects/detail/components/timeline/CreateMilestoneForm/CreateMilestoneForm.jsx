/**
 * add milestone form  for timeline
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'

import { MILESTONE_DEFAULT_VALUES, MILESTONE_TYPE_OPTIONS } from '../../../../../config/constants'
import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import Form from '../Form'
import { isValidStartEndDates } from '../../../../../helpers/utils'
import './CreateMilestoneForm.scss'

class CreateMilestoneForm extends React.Component {
  constructor(props) {
    super(props)

    const { previousMilestone } = props
    const startDate = previousMilestone ? moment.utc(previousMilestone.completionDate || previousMilestone.endDate) : moment.utc()
    this.state = {
      isEditing: false,
      type: '',
      name: '',
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: startDate.add(3, 'days').format('YYYY-MM-DD')
    }

    this.submitForm = this.submitForm.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.onAddClick = this.onAddClick.bind(this)
    this.changeForm = this.changeForm.bind(this)
  }

  cancelEdit() {
    const { previousMilestone } = this.props
    const startDate = previousMilestone ? moment.utc(previousMilestone.completionDate || previousMilestone.endDate) : moment.utc()
    this.setState({
      isEditing: false,
      type: '',
      name: '',
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: startDate.add(3, 'days').format('YYYY-MM-DD')
    })
  }

  onAddClick() {
    this.setState({
      isEditing: true
    })
  }

  submitForm(values) {
    const { onSubmit, previousMilestone } = this.props

    const apiValues = {
      // default values
      ...MILESTONE_DEFAULT_VALUES[values.type],

      // values from the form
      ...values,

      // auto-generated values
      order: previousMilestone ? previousMilestone.order + 1 : 1,
      duration: moment(values.endDate).diff(moment(values.startDate), 'days') + 1,
    }

    onSubmit(apiValues)
  }

  getOptionType(val) {
    return _.find(MILESTONE_TYPE_OPTIONS, (v) => v.value === val).title
  }

  changeForm(values) {
    const { type, name, startDate, endDate } = this.state
    if (values['name'] !== name) {
      this.setState({
        name: values['name']
      })
    }
    if (values['startDate'] !== startDate) {
      this.setState({
        startDate: values['startDate']
      })
    }
    if (values['endDate'] !== endDate) {
      this.setState({
        endDate: values['endDate']
      })
    }
    // set name when select type and name is empty
    if (values['type'] !== type) {
      this.setState({
        type: values['type']
      })
      if (!name) {
        this.setState({
          name: this.getOptionType(values['type'])
        })
      }
    }
  }

  render() {
    const { isAdding, isEditing, type, name, startDate, endDate } = this.state
    if(isAdding) {
      return (
        <LoadingIndicator />
      )
    }
    if (!isEditing) {
      return (
        <div styleName="button-container">
          <button onClick={this.onAddClick} className="tc-btn tc-btn-primary tc-btn-sm">Add Milestone</button>
        </div>
      )
    }
    const editForm = (
      <Form
        fields={[
          {
            label: 'Type',
            placeholder:'Select Type',
            options: MILESTONE_TYPE_OPTIONS,
            name: 'type',
            value: type,
            type: 'select',
          },
          {
            label: 'Name',
            placeholder: 'Name',
            name: 'name',
            value: name,
            type: 'text',
          },
          {
            label: 'Start Date',
            placeholder: 'start date',
            name: 'startDate',
            value: startDate,
            type: 'date',
            validations: {
              isRequired: true,
              isValidStartEndDates
            },
            validationError: 'Please, enter end date',
            validationErrors: {
              isValidStartEndDates: 'End date cannot be before start date'
            }
          },
          {
            label: 'End Date',
            placeholder: 'end date',
            name: 'endDate',
            value: endDate,
            type: 'date',
            validations: {
              isRequired: true,
              isValidStartEndDates
            },
            validationError: 'Please, enter end date',
            validationErrors: {
              isValidStartEndDates: 'End date cannot be before start date'
            }
          }
        ]}
        onCancelClick={this.cancelEdit}
        onSubmit={this.submitForm}
        onChange={this.changeForm}
        submitButtonTitle="Add Milestone"
        disableSubmitButton={!type}
        title="Add Milestone"
      />
    )

    return (
      <div>
        {editForm}
      </div>
    )
  }
}

CreateMilestoneForm.propTypes = {
  onSubmit: PT.func.isRequired,
  previousMilestone: PT.object
}

export default CreateMilestoneForm

