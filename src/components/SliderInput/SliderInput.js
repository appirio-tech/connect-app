'use strict'

import React, { Component, PropTypes } from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import cn from 'classnames'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'
import './SliderInput.scss'

class SliderInput extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
 }

  onChange(value) {
    const {name, options} = this.props
    const newValue = options[value].value
    this.props.setValue(newValue)
    this.props.onChange(name, newValue)
  }

  noOp() {}

  getIndexFromValue(val) {
    return _.findIndex(this.props.options, (t) => t.value === val)
  }

  render() {
    const { options, min, max, step} = this.props
    const value = this.props.getValue()
    const valueIdx = this.getIndexFromValue(value)
    console.log(valueIdx, 'valueIdx')
    const marks = {}
    for(var i=0; i < options.length; i++) {
      marks[i] = options[i].title
    }
    return (
      <div>
        <Slider
          className="SliderInput"
          min={min}
          max={max}
          step={step}
          value={ valueIdx }
          defaultValue={''}
          marks={marks}
          onChange={ this.onChange }
          included={false}
        />
      </div>
    )
  }
}

SliderInput.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired
}
SliderInput.defaultProps = {
  onChange: () => {}
}
export default hoc(SliderInput)
