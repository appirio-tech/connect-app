import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { HOC as hoc } from 'formsy-react'
import BtnGroup from './BtnGroup'

/**
 * This component is a formsy wrapper for the BtnGroup component
 * @param {Object} props Component props
 */
class FormsyBtnGroup extends Component {
  constructor(props) {
    super(props)
    this.changeValue = this.changeValue.bind(this)
  }

  changeValue(value) {
    this.props.setValue(value)
    this.props.onChange && this.props.onChange(this.props.name, value)
  }

  render() {
    const { items } = this.props
    const hasError = !this.props.isPristine() && !this.props.isValid()
    const errorMessage = this.props.getErrorMessage() || this.props.validationError

    return (
      <div>
        <BtnGroup items={items} value={this.props.getValue()} onChange={this.changeValue} />
        {(hasError && errorMessage) ? (<p className="error-message">{errorMessage}</p>)  : null}
      </div>
    )
  }
}

FormsyBtnGroup.PropTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    text: PropTypes.string.isRequired
  })).isRequired
}

export default hoc(FormsyBtnGroup)
