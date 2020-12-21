/**
 * add milestone form  for timeline
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'

import { MILESTONE_TYPE, MILESTONE_TYPE_OPTIONS } from '../../../../../config/constants'
import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import Form from '../Form'
import './CreateMilestoneForm.scss'

class CreateMilestoneForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      type: MILESTONE_TYPE.REPORTING,
      title: 'Reporting',
      startDate: moment.utc().format('YYYY-MM-DD'),
      endDate: moment.utc().add(3, 'days').format('YYYY-MM-DD')
    }

    this.submitForm = this.submitForm.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.onAddClick = this.onAddClick.bind(this)
  }

  cancelEdit() {
    this.setState({
      isEditing: false
    })
  }

  onAddClick() {
    this.setState({
      isEditing: true
    })
  }

  submitForm(values) {
    const { onSubmit } = this.props

    // TODO
    // mock data
    values.status = 'reviewed'
    // TODO  add mock data
    values.duration = 1
    values.hidden =false
    values.completedText = 'completed text'
    values.activeText = 'active text'
    values.description = 'description'
    values.plannedText ='planned text'
    values.details = {}
    values.blockedText = 'blocked text'
    onSubmit(values)
  }

  render() {
    const { isAdding, isEditing, type, title, startDate, endDate } = this.state
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
            placeholder: 'Type',
            options: MILESTONE_TYPE_OPTIONS,
            name: 'type',
            value: type,
            type: 'select',
          },
          {
            label: 'Title',
            placeholder: 'Name',
            name: 'name',
            value: title,
            type: 'text',
            validations: {
              isRequired: true
            },
            validationError: 'Name is required',
          },

          {
            label: 'Start Date',
            placeholder: 'start date',
            name: 'startDate',
            value: startDate,
            type: 'date',
            validations: {
              isRequired: true
            },
            validationError: 'start date is required',
          },
          {
            label: 'End Date',
            placeholder: 'end date',
            name: 'endDate',
            value: endDate,
            type: 'date',
            validations: {
              isRequired: true
            },
            validationError: 'end date is required',
          }
        ]}
        onCancelClick={this.cancelEdit}
        onSubmit={this.submitForm}
        submitButtonTitle="Create Milestone"
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
}

export default CreateMilestoneForm

