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
    this.props.onKeyDown(evt)
  }

  onPaste(evt) {
    const text = evt.clipboardData.getData('text')
    const digitsPattern = /^\d+$/

    // Don't allow pasting non digit text
    if (!digitsPattern.test(text)) {
      evt.preventDefault()
    }
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
  onKeyDown: PT.func,
  onPaste: PT.func,
  onKeyUp: PT.func,
  onValidityChange: PT.func
}


export default PositiveNumberInput
