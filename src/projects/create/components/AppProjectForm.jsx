import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { clearLoadedProject } from '../../actions/project'
import DevicesComponent from './Devices'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'
import {PROJECT_NAME_MAX_LENGTH} from '../../../config/constants'

require('./NewProjectForm.scss')

const projectTypes = [
  {
    value: 'visual_design',
    title: 'Visualize an app idea',
    desc: <p>Wireframes, Visual Design</p>,
    info: ''
  }, {
    value: 'visual_prototype',
    title: 'Prototype an app',
    desc: <p>Visual or HTML prototype</p>,
    info: ''
  }, {
    value: 'app_dev',
    title: 'Fully develop an app',
    desc: <p>Design, Front End, Back End, <br/>Integration and API</p>,
    info: ''
  }
]

class AppProjectForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
  }

  componentWillMount() {
    this.props.clearLoadedProject()
    this.setState({
      canSubmit: false,
      newProject: {
        details: {
          appType: 'ios',
          devices: ['phone'],
          utm: { code: ''}
        },
        type: 'visual_design'
      }
    })
  }

  enableButton() {
    this.setState(_.assign({}, this.state, { canSubmit: true }))
  }

  disableButton() {
    this.setState(_.assign({}, this.state, { canSubmit: false }))
  }


  render () {
    const { processing } = this.props
    const canSubmit = this.state.canSubmit && !processing
    return (
      <Formsy.Form onValidSubmit={this.props.submitHandler} onValid={this.enableButton} onInvalid={this.disableButton}>
        <div className="what-you-like-to-do">
          <h2>What would you like to do?</h2>
          <TCFormFields.SliderRadioGroup
            name="newProject.type"
            label="na"
            value={this.state.newProject.type}
            min={0}
            max={2}
            step={1}
            options={projectTypes}
          />
        </div>

        {/* .pick-target-devices  */}

        <DevicesComponent
          name="newProject.details.devices"
          validations="minLength:1" required
          validationError="Please select at least 1 device"
        />

        <div className="project-info">
          <h2>Project info</h2>

          <TCFormFields.TextInput
            name="newProject.name"
            type="text"
            maxLength={PROJECT_NAME_MAX_LENGTH}
            validations="minLength:1" required
            validationError="Project name is required"
            label="Project Name"
            // placeholder="Enter project name"
            wrapperClass="row"
          />

          <TCFormFields.Textarea
            name="newProject.description"
            label="Description"
            validations="minLength:1" required
            validationError="Please provide a project description"
            wrapperClass="row"
            // placeholder="Mobile app that solves my biggest problem"
          />

          <TCFormFields.TextInput
            name="newProject.details.utm.code"
            label="Invite code (optional)"
            type="text"
            wrapperClass="row center"
            // placeholder="ABCD123"
          />
        </div>
        {/* .project-info */}

        <div className="button-area">
          <button className="tc-btn tc-btn-primary tc-btn-md" type="submit" disabled={!canSubmit}>
            { processing ? 'Creating...' : 'Create Project' }
          </button>
        </div>
        {/* .project-info */}
      </Formsy.Form>
    )
  }
}

AppProjectForm.propTypes = {
  processing: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]).isRequired,
  submitHandler: PropTypes.func.isRequired
}

const actionCreators = { clearLoadedProject }

export default connect(null, actionCreators)(AppProjectForm)
