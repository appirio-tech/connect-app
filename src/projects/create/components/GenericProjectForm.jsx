import React, { Component } from 'react'
import { Form, TextInput, TextareaInput, SubmitButton, Validations } from 'appirio-tech-react-components'

const initialValue = {
  newProject: {
    name: 'initial',
    description: '',
    type: 'generic'
  }
}
class GenericProjectForm extends Component {

  componentWillMount() {
    this.setState(initialValue)
  }

  onSubmit(formValue) {
    console.log(formValue)
  }

  onChange(formValue) {
    this.setState(formValue)
    console.log(formValue)
  }

  render() {
    return (
      <Form initialValue={initialValue} onSubmit={this.onSubmit}>
        <TextInput
          name="newProject.name"
          type="text"
          validations={{
            required: [Validations.isRequired, 'project name is required']
          }}
          label="Project Name"
          placeholder="enter project name"
          disabled={false}
          wrapperClass="row"
        />

        <TextareaInput
          name="newProject.description"
          label="Description"
          disabled={false}
          wrapperClass="row"
        />

        <div className="button-area">
          <SubmitButton className="tc-btn tc-btn-primary tc-btn-md">
            Create Project
          </SubmitButton>
        </div>
      </Form>
    )
  }
}

export default GenericProjectForm
