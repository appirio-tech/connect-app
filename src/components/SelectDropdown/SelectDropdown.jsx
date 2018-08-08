import _ from 'lodash'
import React, { Component } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { HOC as hoc } from 'formsy-react'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'

import './SelectDropdown.scss'

class SelectDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = _.assign(this.state, { selectedOption : null })
  }

  componentWillMount() {
    this.updateSelectedOptionValue(this.props.value)
  }

  updateSelectedOptionValue(value) {
    const { options } = this.props

    let selectedOption = _.find(options, (o) => o.value === value)
    if (!selectedOption) {
      selectedOption = options[0]
    }
    this.setState({
      selectedOption
    }/*, function() {
      // FIXME intentionally commented because it was causing multiple renders when used in mobility testing template
      // Need to further analyze
      // It does not seem to add any value either in both of its usage (it is used in App Screens section
      // for design projects and in mobility testing projects)
      this.props.setValue(this.state.selectedOption.value)
    }*/)
  }

  componentWillReceiveProps(nextProps) {
    // if we changed value by props, then update selected value
    if (this.props.value !== nextProps.value) {
      this.updateSelectedOptionValue(nextProps.value)
    }
  }

  handleClick(option) {
    this.setState({ selectedOption : option }, function() {
      if (this.props.onSelect && typeof this.props.onSelect === 'function')  {
        this.props.onSelect(this.state.selectedOption)
      }
    })
    this.props.setValue(option.value)
  }

  render() {
    const { options, theme } = this.props
    const { selectedOption } = this.state
    const selectedValue = selectedOption.title

    const renderOption = (option, optIdx) => {
      const handleOptionClick = this.handleClick.bind(this, option)
      const preventDefault = (evt) => {
        evt.preventDefault()
        // stop propagation to prevent dropdown from closing when clicking disabled item
        evt.stopPropagation()
      }
      return (
        <li
          key={ optIdx }
          className="dropdown-menu-list-item"
          styleName={cn({ disabled: option.disabled })}
          onClick={ option.disabled ? preventDefault : handleOptionClick }
        >
          <a href="javascript:;">{ option.title }</a>
        </li>
      )
    }
    return (
      <Dropdown theme={ theme } className="SelectDropdown" noPointer>
        <div className="dropdown-menu-header"><span className="tc-link">{ selectedValue }</span></div>
        <ul className="dropdown-menu-list">
          { options.map(renderOption) }
        </ul>
      </Dropdown>
    )
  }
}

SelectDropdown.propTypes = {
  onSelect       : PropTypes.func,
  options        : PropTypes.arrayOf(PropTypes.object).isRequired,
  theme          : PropTypes.string,
  selectedOption : PropTypes.object
}

export default hoc(SelectDropdown)
