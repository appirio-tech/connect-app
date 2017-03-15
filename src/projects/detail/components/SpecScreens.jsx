import React, { Component, PropTypes } from 'react'
import { HOC as hoc } from 'formsy-react'
import { Tooltip } from 'appirio-tech-react-components'
import _ from 'lodash'

import EditAppScreenForm from './EditAppScreenForm'

class SpecScreens extends Component {
  constructor(props) {
    super(props)
    this.addScreen = this.addScreen.bind(this)
  }

  componentWillMount() {
    this.setState({
      screens: [...this.props.screens],
      project: Object.assign({}, this.props.project)
    })
  }

  updateScreen(index, screen) {
    const screens = [...this.state.screens.slice(0, index),
      screen, ...this.state.screens.slice(index + 1)]
    this.setState({ screens })
    this.props.setValue(screens)
  }

  validateScreen(index, screen) {
    const screens = [...this.state.screens.slice(0, index),
      screen, ...this.state.screens.slice(index + 1)]
    this.props.onValidate(!(!_.find(screens, (screen) => screen.name.trim() === '' || screen.description.trim() === '')))
  }

  deleteScreen(index) {
    const screens = [...this.state.screens.slice(0, index),
      ...this.state.screens.slice(index + 1)]
    this.setState({ screens })
    this.props.setValue(screens)
  }

  addScreen(screen, addEmptyScreen) {
    const emptyScreen = {
      description: '',
      name: '',
      importanceLevel: {
        title: '1',
        value: 1
      }
    }
    const screens = [...this.state.screens, addEmptyScreen ? emptyScreen : screen]
    this.setState({ screens })
    this.props.setValue(screens)
    this.props.onValidate(true) // add validation error since the new screen will be empty
  }

  render() {
    const { screens } = this.state
    const { appDefinition } = this.props.project.details
    const numberScreensSelected = parseInt(_.last(_.get(appDefinition, 'numberScreens', '0').split('-')))

    const renderCurrentScreen = (screen, index) => {
      return (
        <div key={index}>
          <div className="app-screen-header">
            <h5 className="screen-title">Screen {index + 1}</h5>
            <button className="tc-btn tc-btn-secondary tc-btn-xs"
              disabled={screen.isInvalid}
              type="button"
              onClick={(evt) => {
                evt.preventDefault()
                this.deleteScreen(index)
              }}
            >
              Delete
            </button>
          </div>
          <EditAppScreenForm
            screen={screen}
            questions={this.props.questions}
            onUpdate={this.updateScreen.bind(this, index)}
            onDelete={this.deleteScreen.bind(this, index)}
            validateScreen={this.validateScreen.bind(this, index)}
          />
        </div>
      )
    }

    return (
      <div>
        {screens.map(renderCurrentScreen)}
        {/*renderNewScreen(screens.length + 1)*/}
        <div className="edit-screen-footer">
          {
            screens.length >= numberScreensSelected ?
            <Tooltip>
              <div className="tooltip-target" id="tooltip-define-screen-error">
                <button disabled className="tc-btn tc-btn-default tc-btn-md">
                  Define another screen
                </button>
              </div>
              <div className="tooltip-body">
                <p className="screen-number-reached-message">
                  You have reached the number of screens selected.
                  <br/>
                  Please select and save a higher number to keep adding new screens.
                </p>
              </div>
            </Tooltip> :
            <button className="tc-btn tc-btn-default tc-btn-md" onClick={() => this.addScreen(null, true)}>
              Define another screen
            </button>
          }
        </div>
      </div>
    )
  }
}

SpecScreens.propTypes = {
  screens: PropTypes.arrayOf(PropTypes.object).isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  project: PropTypes.object.isRequired
}

export default hoc(SpecScreens)
