/**
 * add milestone form  for timeline
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'

import { MILESTONE_TYPE_OPTIONS } from '../../../../../config/constants'
import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import Form from '../Form'
import './CreateMilestoneForm.scss'

class CreateMilestoneForm extends React.Component {
  constructor(props) {
    super(props)

    const {previousMilestone} = props
    this.state = {
      isEditing: false,
      type: '',
      title: '',
      startDate: moment.utc(previousMilestone.endDate).format('YYYY-MM-DD'),
      endDate: moment.utc(previousMilestone.endDate).add(3, 'days').format('YYYY-MM-DD')
    }

    this.submitForm = this.submitForm.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.onAddClick = this.onAddClick.bind(this)
    this.changeForm = this.changeForm.bind(this)
  }

  cancelEdit() {
    const {previousMilestone} = this.props
    this.setState({
      isEditing: false,
      type: '',
      title: '',
      startDate: moment.utc(previousMilestone.endDate).format('YYYY-MM-DD'),
      endDate: moment.utc(previousMilestone.endDate).add(3, 'days').format('YYYY-MM-DD')
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
  changeForm(values) {
    const { type, title, startDate, endDate } = this.state
    if (values['name'] !== title) {
      this.setState({
        title: values['name']
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
    // set title when select type and title is empty
    if (values['type'] !== type) {
      this.setState({
        type: values['type']
      })
      if (!title) {
        this.setState({
          title: values['type'] 
        })
      }
    }
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
            placeholder:'Select Type',
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
        onChange={this.changeForm}
        submitButtonTitle="Create Milestone"
        disableSubmitButton={!type}
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
  previousMilestone: PT.object.isRequired
}

export default CreateMilestoneForm

