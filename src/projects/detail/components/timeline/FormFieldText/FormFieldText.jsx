/**
 * Text/Textarea form field type
 *
 * Props:
 * - hasMaxLength - if defines shows char counter
 * - autoResize - if true than 'text` type field will be
 *                automatically resized depend on the text length
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields

import './FormFieldText.scss'

class FormFieldText extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
    }

    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange(name, value) {
    const { onChange } = this.props

    this.setState({ value })
    onChange && onChange(name, value)
  }

  render() {
    const { theme, label, maxLength } = this.props
    const { value } = this.state

    const hasMaxLength = maxLength > -1
    const inputProps = _.omit(this.props, 'label')
    inputProps.onChange = this.onValueChange

    return (
      <div styleName={cn('milestone-post', theme, { 'has-counter': !!hasMaxLength })}>
        <div styleName="col-left">
          <label styleName="label-title">{label}</label>
        </div>
        <div styleName="col-right">
          {hasMaxLength&& (
            <div styleName="label-counter">{`${value.length}/${maxLength}`}</div>
          )}
          {inputProps.type === 'textarea' ? (
            <TCFormFields.Textarea {...inputProps} />
          ) : (
            <TCFormFields.TextInput {...inputProps} />
          )}
        </div>
      </div>
    )
  }
}

FormFieldText.defaultProps = {
  autoResize: false,
  maxLength: -1,
  onChange: null,
  theme: '',
  value: '',
}

FormFieldText.propTypes = {
  autoResize: PT.bool,
  maxLength: PT.number,
  name: PT.string.isRequired,
  onChange: PT.func,
  theme: PT.string,
  value: PT.string,
}

export default FormFieldText
