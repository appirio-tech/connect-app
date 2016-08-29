import React, { Component, PropTypes } from 'react'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

class GenericProjectForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
  }

  componentWillMount() {
    this.setState({
      newProject: {
        name: null,
        description: null,
        type: 'generic'
      },
      canSubmit: false
    })
  }

  enableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: true}))
  }

  disableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: false}))
  }

  render() {
    return (
      <Formsy.Form onValidSubmit={this.props.submitHandler} onValid={this.enableButton} onInvalid={this.disableButton}>
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
          <button className="tc-btn tc-btn-primary tc-btn-md" type="submit" disabled={!this.state.canSubmit}>Create Project</button>
        </div>
      </Formsy.Form>
    )
  }
}

GenericProjectForm.propTypes = {
  submitHandler: PropTypes.func.isRequired
}

export default GenericProjectForm
