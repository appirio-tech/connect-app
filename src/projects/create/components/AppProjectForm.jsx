
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { clearLoadedProject } from '../../../actions/project'
import DevicesComponent from './Devices'
import { Form, SubmitButton, TextInput, RadioGroupInput, TextareaInput, SliderRadioGroupInput, Validations } from 'appirio-tech-react-components'

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


const initalFormValue = {
  newProject: {
    details: {
      appType: 'ios',
      devices: ['phone'],
      utm: { code: ''}
    },
    type: 'visual_prototype'
  }
}

class AppProjectForm extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.clearLoadedProject()
  }

  // componentWillUpdate(nextProps) {
  //   if (!nextProps.isLoading &&
  //       nextProps.project.id) {
  //     console.log('project created', nextProps.project)
  //     this.props.router.push('/projects/' + nextProps.project.id )
  //   }
  // }

  render () {
    return (
      <Form initialValue={initalFormValue} onSubmit={this.props.submitHandler}>
        <div className="what-you-like-to-do">
          <h2>What would you like to do?</h2>
          <SliderRadioGroupInput
            name="newProject.type"
            label="na"
            min={0}
            max={2}
            step={1}
            options={projectTypes}
          />
        </div>

        {/* .pick-target-devices */}

        <DevicesComponent
          name="newProject.details.devices"
        />

        <RadioGroupInput
          name="newProject.details.appType"
          label="App Type"
          disabled={false}
          wrapperClass="app-type1"
          options={appTypeOptions}
        />

        <div className="project-info">
          <h2>Project info</h2>

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

          <TextInput
            name="details.utm.code"
            label="Invite code (optional)"
            type="text"
            disabled={false}
            wrapperClass="row center"
          />
        </div>
        {/* .project-info */}

        <div className="button-area">
          <SubmitButton className="tc-btn tc-btn-primary tc-btn-md">
            Create Project
          </SubmitButton>
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

const actionCreators = { clearLoadedProject}

export default connect(mapStateToProps, actionCreators)(AppProjectForm)
