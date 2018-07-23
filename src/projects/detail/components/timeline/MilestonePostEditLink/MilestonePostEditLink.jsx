import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields

import './MilestonePostEditLink.scss'

class MilestonePostEditLink extends React.Component {
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

MilestonePostEditLink.defaultProps = {
  maxLength: -1,
  theme: '',
}

MilestonePostEditLink.propTypes = {
  maxLength: PT.number,
  onChange: PT.func,
  theme: PT.string,
  value: PT.string,
}

export default MilestonePostEditLink
