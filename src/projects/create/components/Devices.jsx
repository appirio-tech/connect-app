
import React, { PropTypes } from 'react'
import { TiledCheckboxInput, BaseInputField } from 'appirio-tech-react-components'

import _ from 'lodash'

const devicesSet1 = [
  {
    title: 'Phone',
    value: 'phone',
    desc: 'iOS, Android, Hybrid'
  }, {
    title: 'Tablet',
    value: 'tablet',
    desc: 'iOS, Android, Hybrid'
  }, {
    title: 'Desktop',
    value: 'desktop',
    desc: 'All OS'
  }
]
const devicesSet2 = [
  {
    title: 'Apple Watch',
    value: 'apple-watch',
    desc: 'Watch OS'
  }, {
    title: 'Android Watch',
    value: 'android-watch',
    desc: 'Android Wear'
  }
]

const set1Values = _.map(devicesSet1, 'value')
const set2Values = _.map(devicesSet2, 'value')

class DevicesComponent extends BaseInputField {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    const value = this.props.value || []
    this.setState({
      dirty: false,
      valid: false,
      value,
      set1: _.intersection(set1Values, value),
      set2: _.intersection(set2Values, value)
    })
  }
  onChange(fieldName, newValue) {
    const { onFieldChange, validateField, name, validations} = this.props

    // determine the value that was just added
    let justUpdated = _.difference(newValue, this.state.value)
    if (!justUpdated.length) {
      justUpdated = _.difference(this.state.value, newValue)
    }
    justUpdated = justUpdated[0]

    const newDevices = this.updateDeviceList(this.state.value, justUpdated)
    const results = validateField(newDevices, validations)
    const isValid = results && !results.hasError || true
    this.setState({
      dirty: true,
      value: newDevices,
      set1: _.intersection(set1Values, newDevices),
      set2: _.intersection(set2Values, newDevices),
      valid: isValid,
      errorMessage: _.get(results, 'errorMessage', '')
    })
    onFieldChange(name, newValue, isValid)
  }

  /*
   * This is a wrapper function to update device list state.
   * It uses model Actions from react-redux-form to dispatch the change
   * action.
   */
  updateDeviceList(devices, val) {

    // if val from set1 is selected values from set2 cannot be selected
    // and vice-versa...
    const reset =
      (_.intersection(set1Values, devices).length
        && _.indexOf(set2Values, val) > -1)
      ||  (_.intersection(set2Values, devices).length
        && _.indexOf(set1Values, val) > -1)

    if (reset) {
      return [val]
    } else {
      return _.xor(devices, [val])
    }
  }

  render() {
    return (
      <div className="pick-target-devices">
        <h2>Pick target device(s)</h2>
        <div className="target-selectors">
          <TiledCheckboxInput
            key={0}
            name="devices1"
            label=""
            value={this.state.set1}
            wrapperClass="target-selector non-wearable-devices"
            options={devicesSet1}
            onFieldChange={this.onChange}
          />
          <div className="divider">
              Or
          </div>
          <TiledCheckboxInput
            key={1}
            name="devices2"
            label=""
            value={this.state.set2}
            wrapperClass="target-selector wearable-devices"
            options={devicesSet2}
            onFieldChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}
DevicesComponent.displayName = 'DevicesInputField'
DevicesComponent.defaultProps = _.merge({}, DevicesComponent.defaultProps, {value: []})

DevicesComponent.propTypes = _.assign({}, DevicesComponent.propTypes, {
  value: PropTypes.arrayOf(PropTypes.string.isRequired)
})

export default DevicesComponent
