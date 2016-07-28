

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, actions as modelActions} from 'react-redux-form'
import { clearLoadedProject } from '../../../actions/project'
import { withRouter } from 'react-router'
import { InputFormField, TextareaFormField } from 'appirio-tech-react-components'

class WorkProjectForm extends Component {

  componentWillMount() {
    this.props.clearLoadedProject()
    // set project type to generic
    this.props.assignProjectType('generic')
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isLoading && nextProps.project.id) {
      console.log('project created', nextProps.project)
      this.props.router.push('/projects/' + nextProps.project.id )
    }
  }

  render() {
    return (
      <Form model="newProject" onSubmit={(val) => this.props.submitHandler(val)}>
        <div className="project-info">
            <h2>Project info</h2>

            <div className="row">
              <InputFormField
                id="name"
                validators={{
                  required: (val) => val
                }}
                errorMessages={{
                  required: 'Please provide a project name'
                }}
                formModelName="newProjectForm"
                fieldModelName="newProject.name"
                label="Project Name"
                placeholder="Enter project name"
                inputType="text"
              />
            </div>

            <div className="row">
              <TextareaFormField
                id="description"
                formModelName="newProjectForm"
                fieldModelName="newProject.description"
                label="Description"
              />
            </div>

            <div className="row center">
              <InputFormField
                id="utm.code"
                formModelName="newProjectForm"
                fieldModelName="newProject.utm.code"
                label="Invite Code (optional):"
                placeholder=""
                inputType="text"
              />

            </div>

        </div>

        <button>
          Create
        </button>
      </Form>
    )
  }
}

WorkProjectForm.propTypes = {
  submitHandler: PropTypes.func.isRequired
}

const mapStateToProps = ({ newProject, projectState }) => ({
  newProject,
  isLoading: projectState.isLoading,
  project: projectState.project
})

function assignProjectType(type) {
  return (dispatch) => {
    dispatch(modelActions.change('newProject.type', type))
  }
}
const mapActionsToProps = { clearLoadedProject, assignProjectType }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(WorkProjectForm))
