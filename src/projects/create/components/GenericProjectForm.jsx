import React, { Component, PropTypes } from 'react'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

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
          validations="minLength:1" required
          validationError="Project name is required"
          label="Project Name"
          placeholder="enter project name"
          disabled={false}
          wrapperClass="row"
        />

        <TCFormFields.Textarea
          name="newProject.description"
          label="Description"
          validations="minLength:1" required
          validationError="Please provide a project description"
          placeholder="Mobile app that solves my biggest problem"
          disabled={false}
          wrapperClass="row"
          placeholder="Mobile app that solves my biggest problem"
        />

        <TCFormFields.TextInput
          name="newProject.details.utm.code"
          label="Invite code (optional)"
          type="text"
          disabled={false}
          wrapperClass="row center"
          placeholder="ABCD123"
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
