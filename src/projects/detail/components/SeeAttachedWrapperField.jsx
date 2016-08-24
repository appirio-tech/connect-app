import React, { Component } from 'react'
import { TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

const SeeAttachedWrapperField = ComposedComponent => class extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(field, value) {
    const origField = field.substring(0, field.lastIndexOf('.'))
    if (field.indexOf('.seeAttached') > -1 && value) {
      // reset wrapped fields value
      this.refs[origField+'.value'].setValue('')
    } else if (field.indexOf('.value') > -1 && this.refs[origField+'.seeAttached'].getValue()) {
      this.refs[origField+'.seeAttached'].setValue(false)
    }
  }

  render() {
    const isChecked = _.get(this.props, 'value.seeAttached', false)
    const ccProps = _.without(this.props, ['name'])
    ccProps.name = this.props.name + '.value'
    ccProps.onChange = this.onChange
    const label = 'Skip question - I have a document (will upload at end of section)'
    const cbName = `${this.props.name}.seeAttached`
    return (
      <div>
        { !isChecked && <ComposedComponent ref={ccProps.name} {...ccProps} /> }
        <TCFormFields.Checkbox ref={cbName} name={cbName} label={label} onChange={this.onChange} />
      </div>
    )
  }
}

SeeAttachedWrapperField.propTypes = {

}

export default SeeAttachedWrapperField
