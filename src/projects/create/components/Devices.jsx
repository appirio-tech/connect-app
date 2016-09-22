
import React, { Component, PropTypes } from 'react'
import { HOC as hoc } from 'formsy-react'
import classNames from 'classnames'
import _ from 'lodash'

const deviceSets = [
  {
    classname: 'non-wearable-devices',
    options: [
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
  },
  {
    classname: 'wearable-devices',
    options: [
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
  }
]

const set1Values = _.map(deviceSets[0].options, 'value')
const set2Values = _.map(deviceSets[1].options, 'value')

class DevicesComponent extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(value, event) {
    event.preventDefault()
    const curValue = this.props.getValue()
    const newValue = _.xor(curValue, [value])
    // if last item being unselected do nothing
    if (!newValue.length) return false
    // determine the value that was just added
    let justUpdated = _.difference(newValue, curValue)
    if (!justUpdated.length) {
      justUpdated = _.difference(curValue, newValue)
    }
    justUpdated = justUpdated[0]

    const newDevices = this.updateDeviceList(curValue, justUpdated)

    this.props.setValue(newDevices)
    this.props.onChange(this.props.name, newDevices)
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
    const { optionsSet, isPristine, isValid, isFormDisabled, getErrorMessage, getValue, validationError } = this.props
    const hasError = !isPristine() && !isValid()
    const disabled = isFormDisabled() || this.props.disabled
    const errorMessage = getErrorMessage() || validationError
    const curValue = getValue()

    const renderOption = (opt, key) => {
      // adding classes eg. "phone active"
      const itemClassnames = classNames(opt.value, {
        active: _.indexOf(curValue, opt.value) > -1
      })
      const handleClick = this.onChange.bind(this, opt.value)
      return (
        <a onClick={ !disabled && handleClick } className={itemClassnames} key={key} >
          <span className="icon"> </span>
          <span className="title">{opt.title}</span>
          <small>{opt.desc}</small>
        </a>
      )
    }

    const renderOptionsSet = () => {
      const dom = []
      for (let i = 0; i < optionsSet.length; i++) {
        dom.push(
          <div key={'set'+i} className={'target-selector ' + optionsSet[i].classname}>
            {optionsSet[i].options.map(renderOption)}
          </div>
        )
        if (i < optionsSet.length-1) {
          dom.push(<div key={'divider'+i} className="divider"> </div>)
        }
      }
      return dom
    }

    return (
      <div className="pick-target-devices">
        <h2 className="project-info__title--device">Pick target device(s)</h2>
        <div className="target-selectors">
          {renderOptionsSet()}
        </div>
        { hasError ? (<p className="error-message">{errorMessage}</p>) : null}
      </div>
    )
  }
}
DevicesComponent.defaultProps = {
  optionsSet: deviceSets,
  onChange: () => {}
}

DevicesComponent.propTypes = {
  optionsSet: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default hoc(DevicesComponent)
