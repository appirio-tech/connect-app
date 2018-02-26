import React, { Component } from 'react'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
import _ from 'lodash'

const SeeAttachedWrapperField = (ComposedComponent, defaultValue = '') => class extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    this.setState(Object.assign({}, { displayComponent: !_.get(this.props.value, 'seeAttached', false)}))
  }

  onChange(field, value) {
    if (field.indexOf('.seeAttached') > -1) {
      const origField = field.substring(0, field.lastIndexOf('.'))
      const valueRef = this.refs[origField+'.value']
      // reset wrapped fields value
      if (value && valueRef) {
        if (valueRef.resetValue)
          valueRef.resetValue()
        else if (valueRef.props.resetValue)
          valueRef.props.resetValue()
      }
      this.setState(Object.assign({}, {displayComponent: !value}))
    }
  }

  render() {
    const cb = {
      name: `${this.props.name}.seeAttached`,
      value: _.get(this.props.value, 'seeAttached', false)
    }
    const ccProps = _.merge({}, _.omit(this.props, ['name', 'value']), {
      name: this.props.name + '.value',
      value: _.get(this.props.value, 'value', defaultValue),
      onChange: this.onChange
    })

    const label = 'Skip question - I have a document (will upload at end of section)'

    return (
      <div key={this.props.name}>
        {this.state.displayComponent && <ComposedComponent ref={ccProps.name} {...ccProps} />}
        <p className="description">{ccProps.description}</p>
        <TCFormFields.Checkbox ref={cb.name} name={cb.name} label={label} onChange={this.onChange} value={cb.value}/>
      </div>
    )
  }
}

SeeAttachedWrapperField.propTypes = {

}

export default SeeAttachedWrapperField
