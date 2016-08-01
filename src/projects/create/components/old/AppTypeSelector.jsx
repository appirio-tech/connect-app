
import React, { Component, PropTypes } from 'react'
import { Field } from 'react-redux-form'

const typeOptions = [{
  val: 'ios',
  label: 'iOS'
}, {
  val: 'android',
  label: 'Android'
}, {
  val: 'web',
  label: 'Web'
}, {
  val: 'hybrid',
  label: 'Hybrid'
}]

class AppTypeSelector extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // creating a function to render each radio button
    const typeFunc = (item, index) => {
      // adding classes eg. "phone active"
      const id = 'radio-option-' + index
      return (
        <div className="radio" key={index}>
          <input
            type="radio"
            name="app-type-choice"
            id={id}
            value={item.val}
          />
          <label htmlFor={id}>{item.label}</label>
        </div>
      )
    }
    return (
      <div className="app-type">
        <h4>App Type:</h4>
        <Field model={this.props.modelName}>
          { typeOptions.map(typeFunc) }
        </Field>
      </div>
    )
  }
}


AppTypeSelector.propTypes = {
  modelName: PropTypes.string.isRequired
}

export default AppTypeSelector
