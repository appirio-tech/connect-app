
import React, { Component, PropTypes } from 'react'
import { actions as modelActions } from 'react-redux-form'
import { connect } from 'react-redux'
import _ from 'lodash'
import classNames from 'classnames'

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

class DevicesComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { devices } = this.props
    // creating a function to render each device item
    const deviceFunc = (item, index) => {
      // adding classes eg. "phone active"
      const itemClassnames = classNames(
        item.val, {
          active: _.indexOf(devices, item.val) > -1
        }
      )
      return (
        <a onClick={this.props.toggleDevice.bind(item.val)}
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
}

/*
 * This is a wrapper function to update device list state.
 * It uses model Actions from react-redux-form to dispatch the change
 * action.
 */
function updateDeviceList(devicesBeforeAction, val) {
  return (dispatch) => {
    const modelName = 'newProject.details.devices'
    const set1 = _.map(devicesSet1, 'val')
    const set2 = _.map(devicesSet2, 'val')

    // if val from set1 is selected values from set2 cannot be selected
    // and vice-versa...
    const reset =
      (_.intersection(set1, devicesBeforeAction).length
        && _.indexOf(set2, val) > -1)
      ||  (_.intersection(set2, devicesBeforeAction).length
        && _.indexOf(set1, val) > -1)

    if (reset) {
      dispatch(modelActions.change(modelName, [val]))
    } else {
      dispatch(modelActions.xor(modelName, val))
    }
  }
}

DevicesComponent.propTypes = {
  devices: PropTypes.arrayOf(PropTypes.string).isRequired
}
const actionCreators = { updateDeviceList }
const mapStateToProps = ({newProject}) => ({
  devices: newProject.details.devices
})

// Merging props so that we can use determine the current
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const props  = Object.assign({}, ownProps, stateProps, dispatchProps, {
    toggleDevice: (val) => {
      props.updateDeviceList(stateProps.devices, val)
    }
  })
  return props
}

export default connect(mapStateToProps, actionCreators, mergeProps)(DevicesComponent)
