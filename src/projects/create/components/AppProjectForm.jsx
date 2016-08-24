
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { clearLoadedProject } from '../../actions/project'
import DevicesComponent from './Devices'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

require('./CreateProject.scss')

const appTypeOptions = [
  {
    value: 'ios',
    label: 'iOS'
  }, {
    value: 'android',
    label: 'Android'
  }, {
    value: 'web',
    label: 'Web'
  }, {
    value: 'hybrid',
    label: 'Hybrid'
  }
]

const projectTypes = [
  {
    value: 'visual_design',
    title: 'Visualize an app idea',
    desc: <p><strong>5-7 days,</strong> from <strong>$3,500</strong></p>,
    info: 'Wireframes, Visual Design'
  }, {
    value: 'visual_prototype',
    title: 'Prototype an app',
    desc: <p><strong>14+ days,</strong> from <strong>$15,000</strong></p>,
    info: 'Visual or HTML prototype'
  }, {
    value: 'app_dev',
    title: 'Fully develop an app',
    desc: <p>from <strong>$30,000 </strong></p>,
    info: 'Design, Front End, Back End, <br/>Integration and API'
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
        type: 'visual_prototype'
      }
    })
  }

  enableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: true}))
  }

  disableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: false}))
  }


  render () {
    return (
      <Formsy.Form onValidSubmit={this.props.submitHandler} onValid={this.enableButton} onInvalid={this.disableButton}>
        <div className="what-you-like-to-do">
          <h2>What would you like to do?</h2>
          <TCFormFields.SliderRadioGroup
            name="newProject.type"
            label="na"
            min={0}
            max={2}
            step={1}
            options={projectTypes}
          />
        </div>

        {/* .pick-target-devices  */}

        <DevicesComponent
          name="newProject.details.devices"
        />

        <TCFormFields.RadioGroup
          name="newProject.details.appType"
          label="App Type"
          disabled={false}
          wrapperClass="app-type"
          options={appTypeOptions}
        />
        <div className="section-divider"></div>
        <div className="project-info">
          <h2>Project info</h2>

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
        </div>
        {/* .project-info */}

        <div className="button-area">
          <button className="tc-btn tc-btn-primary tc-btn-md" type="submit" disabled={!this.state.canSubmit}>
            Create Project
          </button>
        </div>
        {/* .project-info */}
      </Formsy.Form>
    )
  }
}

AppProjectForm.propTypes = {
  submitHandler: PropTypes.func.isRequired
}

const actionCreators = { clearLoadedProject }

export default connect(null, actionCreators)(AppProjectForm)
