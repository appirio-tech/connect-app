/**
 * Text field with counter
 */
import React from 'react'
import PropTypes from 'prop-types'
import { TCFormFields } from 'appirio-tech-react-components'
import './TextInputWithCounter.scss'

class TextInputWithCounter extends React.Component {
  constructor(props) {
    super(props)

    const initialValue = this.props.value || ''
    this.state = {
      value: initialValue,
      count: initialValue.length
    }
  }

  render() {
    return (
      <div className="text-input-with-counter">
        <div className="counter"><span>{this.state.count}</span> / {this.props.maxLength}</div>
        <TCFormFields.TextInput
          {...this.props}
          onChange={(name, value) => {
            this.setState({
              value,
              count: value.length
            })
            if (this.props.onChange) {
              this.props.onChange(name, value)
            }
          }}
        />
      </div>
    )
  }
}

TextInputWithCounter.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  maxLength: PropTypes.string.isRequired
}

export default TextInputWithCounter
