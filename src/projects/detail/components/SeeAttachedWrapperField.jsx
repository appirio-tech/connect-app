import React, { Component } from 'react'
import { TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

const SeeAttachedWrapperField = ComposedComponent => class extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    this.setState(Object.assign({}, { displayComponent: !_.get(this.props.value, 'seeAttached', false)}))
  }

  onChange(field, value) {
    const origField = field.substring(0, field.lastIndexOf('.'))
    const valueRef = this.refs[origField+'.value']
    // const cbRef = this.refs[origField+'.seeAttached']
    if (field.indexOf('.seeAttached') > -1) {
      // reset wrapped fields value
      if (value && valueRef) {
        valueRef.resetValue()
      }
      this.setState(Object.assign({}, { displayComponent: !value}))
    }
  }

  render() {
    const cb = {
      name: `${this.props.name}.seeAttached`,
      value: _.get(this.props.value, 'seeAttached', false)
    }
    const ccProps = _.merge({}, _.without(this.props, ['name', 'value']), {
      name: this.props.name + '.value',
      value: _.get(this.props.value, 'value', undefined),
      onChange: this.onChange
    })

    const label = 'Skip question - I have a document (will upload at end of section)'

    return (
      <div>
        {this.state.displayComponent && <ComposedComponent ref={ccProps.name} {...ccProps} />}
        <TCFormFields.Checkbox ref={cb.name} name={cb.name} label={label} onChange={this.onChange} value={cb.value}/>
      </div>
    )
  }
}

SeeAttachedWrapperField.propTypes = {

}

export default SeeAttachedWrapperField
