
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, actions as modelActions } from 'react-redux-form'
import { createProject, clearLoadedProject } from '../../actions/project'
import { withRouter } from 'react-router'
import { InputFormField, TextareaFormField } from 'appirio-tech-react-components'
import _ from 'lodash'
import classNames from 'classnames'

require('./CreateProject.scss')

const devicesSet1 = [
  {
    title: 'Phone',
    val: 'phone',
    desc: 'iOS, Android, Hybrid'
  }, {
    title: 'Tablet',
    val: 'tablet',
    desc: 'iOS, Android, Hybrid'
  }, {
    title: 'Desktop',
    val: 'desktop',
    desc: 'All OS'
  }
]
const devicesSet2 = [
  {
    title: 'Apple Watch',
    val: 'apple-watch',
    desc: 'Watch OS'
  }, {
    title: 'Android Watch',
    val: 'android-watch',
    desc: 'Android Wear'
  }
]


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

  renderDevices() {
    const devices = this.props.newProject.details.devices
    const deviceFunc = (item, index) => {
      const itemClassnames = classNames(
        item.val, {
          active: _.indexOf(devices, item.val) > -1
        }
      )
      const handleClick = () => this.props.toggleDevice(item.val)
      return (
        <a onClick={handleClick}
          className={itemClassnames}
          key={index}
        >
            <span className="icon"></span>
            <span className="title">{item.title}</span>
            <small>{item.desc}</small>
        </a>
      )
    }

    return (
      <div className="pick-target-devices">
        <h2>Pick target device(s)</h2>
        <div className="target-selector">
          { devicesSet1.map(deviceFunc) }
          <div className="divider">
              Or
          </div>
          { devicesSet2.map(deviceFunc) }
        </div>
      </div>
    )
  }

  handleSubmit(val) {
    this.props.submitHandler(val)
  }

  render () {
    const devices = this.renderDevices()

    return (
      <Form model="newProject" onSubmit={this.handleSubmit}>
        <div className="what-you-like-to-do">
          <h2>What would you like to do?</h2>
          <div className="type-selector">
            <div className="selector">
              <h3>Visualize an app idea</h3>
              <p><strong>5-7 days,</strong> from <strong>$3,500</strong></p>
            </div>

            <div className="selector active">
              <h3>Prototype an app</h3>
              <p><strong>14+ days,</strong> from <strong>$15,000</strong></p>
            </div>

            <div className="selector">
              <h3>Fully develop an app</h3>
              <p>from <strong>$30,000 </strong></p>
            </div>
          </div>

          <div className="range-slider">
            <input className="range-slider__range" type="range" min="1" max="3" />
            <p></p>
          </div>

          <div className="info-selector">
            <span>Wireframes, Visual Design</span>
            <span className="active">Visual or HTML prototype</span>
            <span>Design, Front End, Back End, <br/>Integration and API</span>
          </div>
        </div>
        {/* .what-you-like-to-do */}

        { devices }

        {/* .pick-target-devices */}

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
          <a href="#" className="tc-btn">Create Project</a>
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

function modelActionCreator(modelName, reset, val) {
  return (dispatch) => {
    if (reset) {
      dispatch(modelActions.change(modelName, [val]))
    } else {
      dispatch(modelActions.xor(modelName, val))
    }
  }
}
const actionCreators = { createProject, clearLoadedProject, modelActionCreator }

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const props  = Object.assign({}, ownProps, stateProps, dispatchProps, {
    toggleDevice: (val) => {
      const modelName = 'newProject.details.devices'
      // if val from set1 is selected values from set2 cannot be selected
      const set1 = _.map(devicesSet1, 'val')
      const set2 = _.map(devicesSet2, 'val')
      let reset = false
      if (_.intersection(set1, stateProps.newProject.details.devices).length) {
        if (_.indexOf(set2, val) > -1) {
          reset = true
        }
      } else if (_.intersection(set2, stateProps.newProject.details.devices).length) {
        if (_.indexOf(set1, val) > -1) {
          reset = true
        }
      }
      props.modelActionCreator(modelName, reset, val)
    }
  })
  return props
}

export default withRouter(connect(mapStateToProps, actionCreators, mergeProps)(AppProjectForm))
