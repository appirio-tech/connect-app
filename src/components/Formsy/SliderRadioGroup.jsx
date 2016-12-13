'use strict'

import React, { Component, PropTypes } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'

class SliderRadioGroup extends Component {
  constructor(props) {
    super(props)
    this.onSlide = this.onSlide.bind(this)
  }

  componentWillMount() {
    const idx = Math.max(this.getIndexFromValue(this.props.getValue()), 0)
    this.setState({value: idx})
  }

  onChange(idx) {
    idx = parseInt(idx)
    const {name, options} = this.props
    const newValue = options[idx].value
    this.setState({value: idx})
    this.props.setValue(newValue)
    this.props.onChange(name, newValue)
  }

  noOp() {}

  onSlide(event) {
    this.onChange(event.target.value)
  }

  getIndexFromValue(val) {
    return _.findIndex(this.props.options, (t) => t.value === val)
  }

  render() {
    const { options, min, max, step} = this.props
    const value = this.props.getValue()
    const valueIdx = this.getIndexFromValue(value)
    // creating a function to render each type title + desc
    const itemFunc = (item, index) => {
      // handle active class
      const itemClassnames = cn( 'selector', {
        active: value === item.value
      })
      const idx = this.getIndexFromValue(item.value)
      const handleClick = this.onChange.bind(this, idx)
      return (
        <div className={itemClassnames} key={index} onClick={ handleClick } >
          <h3>{item.title}</h3>
          {item.desc}
        </div>
      )
    }

    // function to render item info
    const itemInfoFunc = (item, index) => {
      // handle active class
      const itemClassnames = cn({active: value === item.value})
      const idx = this.getIndexFromValue(item.value)
      const handleClick = this.onChange.bind(this, idx)
      return (
        <span
          onClick={ handleClick }
          className={itemClassnames}
          key={index}
          dangerouslySetInnerHTML={{__html: item.info}}
        />
      )
    }
    return (
      /**
       * TODO Using onInput trigger instead of onChange.
       * onChange is showing some funky behavior at least in Chrome.
       * This functionality should be tested in other browsers
       * onChange={this.noOp}
       */
      <div>

        <div className="range-slider">
          <input
            type="range"
            className="range-slider__range"
            min={min}
            max={max}
            step={step}
            value={valueIdx}
            onChange={ this.onSlide }
          />
        </div>

        <div className="type-selector">
          {options.map(itemFunc)}
        </div>

        <div className="info-selector">
          {options.map(itemInfoFunc)}
        </div>

      </div>
    )
  }
}

SliderRadioGroup.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired
}
SliderRadioGroup.defaultProps = {
  onChange: () => {}
}
export default hoc(SliderRadioGroup)
