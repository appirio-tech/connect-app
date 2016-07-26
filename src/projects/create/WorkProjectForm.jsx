

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Errors, Field } from 'react-redux-form'
import { createProject } from '../../actions/project'
import { hashHistory } from 'react-router'

class WorkProjectForm extends Component {

  handleSubmit(val) {
    console.log('creating project', val)
    this.props.createProject(val)
    // TODO handle success
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isLoading &&
        nextProps.project.id) {
      debugger
      console.log('project created', nextProps.project)
      hashHistory.transitionTo('/projects/' + nextProps.project.id )
    }
  }

  render() {

    let { newProject } = this.props

    return (
      <Form model="newProject" onSubmit={(val) => this.handleSubmit(val)}>
        <Field model="newProject.name"
          errors={{
            required: (val) => !val || !val.length
          }}>
          <label>Project Name</label>
          <input type="text" placeholder="Enter project name ... "/>
        </Field>

        <div>
        <Errors
          model="newProject.name"
          messages={{
            required: 'Please enter an email address.'
          }} />
        </div>

        <Field model="newProject.description"
          validators={{
            required: (val) => val && val.length
          }}>
          <label>Description</label>
          <textarea />
        </Field>

        <button>
          Create
        </button>
      </Form>
    )
  }
}

const mapStateToProps = ({ newProject, projectState }) => ({
  newProject,
  isLoading: projectState.isLoading,
  project: projectState.project
})

const mapActionsToProps = { createProject }

export default connect(mapStateToProps, mapActionsToProps)(WorkProjectForm)
