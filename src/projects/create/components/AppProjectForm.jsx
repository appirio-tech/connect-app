
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-redux-form'
import { withRouter } from 'react-router'
import _ from 'lodash'
import classNames from 'classnames'

import { createProject, clearLoadedProject } from '../../../actions/project'
import DevicesComponent from './Devices'
import ProjectTypeSelector from './ProjectTypeSelector/ProjectType'
import { InputFormField, TextareaFormField } from 'appirio-tech-react-components'

require('./CreateProject.scss')


class AppProjectForm extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.clearLoadedProject()
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isLoading &&
        nextProps.project.id) {
      console.log('project created', nextProps.project)
      this.props.router.push('/projects/' + nextProps.project.id )
    }
  }

  render () {

    return (
      <Form model="newProject" onSubmit={(val) => this.props.submitHandler(val)}>
        {/* .what-you-like-to-do */}

        <ProjectTypeSelector
          modelName="newProject.type"
          type={this.props.newProject.type}
        />

        {/* .pick-target-devices */}
        <DevicesComponent
          modelName="newProject.details.devices"
          devices={this.props.newProject.details.devices}
        />

        <div className="app-type">
          <h4>App Type:</h4>

          <div className="radio">
            <input type="radio" name="single-choice" id="radio-option-1" />
            <label htmlFor="radio-option-1">iOS</label>
          </div>
          <div className="radio">
            <input type="radio" name="single-choice" id="radio-option-2" />
            <label htmlFor="radio-option-2">Android</label>
          </div>
          <div className="radio">
            <input type="radio" name="single-choice" id="radio-option-3" />
            <label htmlFor="radio-option-3">Web</label>
          </div>
          <div className="radio">
            <input type="radio" name="single-choice" id="radio-option-4" />
            <label htmlFor="radio-option-4">Hybrid</label>
          </div>
        </div>
        {/* .pick-target-devices */}

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
        {/* .project-info */}

        <div className="button-area">
          <button className="tc-btn">Create Project</button>
        </div>
        {/* .project-info */}
      </Form>
    )
  }
}

AppProjectForm.propTypes = {
  submitHandler: PropTypes.func.isRequired
}

const mapStateToProps = ({ newProject, projectState }) => ({
  newProject,
  isLoading: projectState.isLoading,
  project: projectState.project
})

const actionCreators = { createProject, clearLoadedProject}

export default withRouter(connect(mapStateToProps, actionCreators)(AppProjectForm))
