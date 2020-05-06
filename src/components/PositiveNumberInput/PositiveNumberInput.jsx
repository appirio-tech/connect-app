import React from 'react'
import PT from 'prop-types'
import { noop, omit } from 'lodash'

class PositiveNumberInput extends React.PureComponent {
  constructor(props) {
    super(props)

    this.isInputValid = true

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onPaste = this.onPaste.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  onKeyDown(evt) {
    const isPrintableKey = evt.key.length === 1 && !(evt.ctrlKey || evt.metaKey)
    const digitPattern = /\d/

    // Don't allow typing non digit characters
    if (isPrintableKey && !digitPattern.test(evt.key)) {
      evt.preventDefault()
    }
    isPrintableKey && this.enforceInputBelowMax(evt)
    this.props.onKeyDown(evt)
  }

  onPaste(evt) {
    const text = evt.clipboardData.getData('text')
    const digitsPattern = /^\d+$/

    // Don't allow pasting non digit text
    if (!digitsPattern.test(text)) {
      evt.preventDefault()
    }
    this.enforceInputBelowMax(evt)
    this.props.onPaste(evt)
  }

  onKeyUp(evt) {
    const isValid = evt.target.validity.valid
    if (isValid !== this.isInputValid) {
      this.isInputValid = isValid
      this.props.onValidityChange(isValid)
    }
    this.props.onKeyUp(evt)
  }

  /**
   * Makes sure the input value is kept below the max value
   * @param {Event} evt The keydown or paste event
   */
  enforceInputBelowMax(evt) {
    const { onChange } = this.props
    const previousValue = evt.target.value
    if (this.isBelowMaxLimit(previousValue)) {
      // persists the synthetic event. So that we can use it inside setTimeout
      evt.persist()

      // setTimeout to let the input element set the actual value after the keydown/paste
      setTimeout(() => {
        if (!this.isBelowMaxLimit(evt.target.value)) {
          evt.target.value = previousValue
          onChange && onChange(evt)
        }
      })
    }
  }

  isBelowMaxLimit(text) {
    const { max = Infinity } = this.props
    return Number(text) <= max
  }

  render() {
    const props = omit(this.props, ['onValidityChange'])
    return <input type="number" min={0} {...props} onKeyDown={this.onKeyDown} onPaste={this.onPaste} onKeyUp={this.onKeyUp} />
  }
}

PositiveNumberInput.defaultProps = {
  onKeyDown: noop,
  onPaste: noop,
  onKeyUp: noop,
  onValidityChange: noop

}

PositiveNumberInput.propTypes = {
  max: PT.number,
  onKeyDown: PT.func,
  onPaste: PT.func,
  onKeyUp: PT.func,
  onValidityChange: PT.func
}


export default PositiveNumberInput
