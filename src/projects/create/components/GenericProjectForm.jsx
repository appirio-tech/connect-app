import React, { Component, PropTypes } from 'react'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'
import {PROJECT_NAME_MAX_LENGTH} from '../../../config/constants'

class GenericProjectForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    this.setState({
      newProject: {
        name: null,
        description: null
      },
      canSubmit: false
    })
  }

  onSubmit(val) {
    val.newProject.type = 'generic'
    this.props.submitHandler(val)
  }
  enableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: true}))
  }

  disableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: false}))
  }

  render() {
    const { processing } = this.props
    const canSubmit = this.state.canSubmit && !processing
    return (
      <Formsy.Form className="generic-project-form" onValidSubmit={this.onSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
        <TCFormFields.TextInput
          name="newProject.name"
          type="text"
          validations="isRequired"
          validationError="Project name is required"
          maxLength={PROJECT_NAME_MAX_LENGTH}
          label="Project Name"
          // placeholder="enter project name"
          disabled={false}
          wrapperClass="row"
        />

        <TCFormFields.Textarea
          name="newProject.description"
          label="Description"
          validations="isRequired"
          validationError="Please provide a project description"
          // placeholder="Mobile app that solves my biggest problem"
          disabled={false}
          wrapperClass="row"
        />

        <TCFormFields.TextInput
          name="newProject.details.utm.code"
          label="Reference code (optional)"
          maxLength={25}
          type="text"
          disabled={false}
          wrapperClass="row center"
          // placeholder="ABCD123"
        />

        <div className="button-area">
          <button className="tc-btn tc-btn-primary tc-btn-md" type="submit" disabled={!canSubmit}>
            { processing ? 'Creating...' : 'Create Project' }
          </button>
        </div>
      </Formsy.Form>
    )
  }
}

GenericProjectForm.propTypes = {
  processing: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]).isRequired,
  submitHandler: PropTypes.func.isRequired
}

export default GenericProjectForm
