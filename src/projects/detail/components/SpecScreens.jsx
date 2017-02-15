import React, { Component, PropTypes } from 'react'
import { HOC as hoc } from 'formsy-react'

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
    let screens = [...this.state.screens.slice(0, index),
      screen, ...this.state.screens.slice(index + 1)]
    this.setState({ screens })
    this.props.setValue(screens)
  }

  deleteScreen(index) {
    let screens = [...this.state.screens.slice(0, index),
      ...this.state.screens.slice(index + 1)]
    this.setState({ screens })
    this.props.setValue(screens)
  }

  addScreen(screen) {
    let screens = [...this.state.screens, screen]
    this.setState({ screens })
    this.props.setValue(screens)
  }

  render() {
    const { screens } =  this.state

    const renderCurrentScreen = (screen, index) => {
      return (
        <div key={index}>
          <div className="dashed-bottom-border">
            <h5 className="screen-title">Screen {index + 1}</h5>
          </div>
          <EditAppScreenForm 
            new={false} 
            screen={screen} 
            questions={this.props.questions}
            onUpdate={this.updateScreen.bind(this, index)}
            onDelete={this.deleteScreen.bind(this, index)}
          />
        </div>
      )
    }

    const renderNewScreen = (newIndex) => {
      return (
        <div>
          <div className="dashed-bottom-border">
            <h5 className="screen-title">Screen {newIndex}</h5>
          </div>
          <EditAppScreenForm 
            new={true} 
            questions={this.props.questions}
            onSubmit={this.addScreen} />
        </div>
      )
    }
    
    return (
      <div>
        {screens.map(renderCurrentScreen)}
        {renderNewScreen(screens.length + 1)}
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
