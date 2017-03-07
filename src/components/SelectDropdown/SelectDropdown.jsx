require('./SelectDropdown.scss')

import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { HOC as hoc } from 'formsy-react'
import Dropdown from '../Dropdown/Dropdown'

class SelectDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = _.assign(this.state, { selectedOption : null })
  }

  componentWillMount() {
    this.setState({
      selectedOption: this.props.selectedOption || this.props.options[0]
    }, function() {
      this.props.setValue(this.state.selectedOption)
    })
  }

  handleClick(option) {
    this.setState({ selectedOption : option }, function() {
      if (this.props.onSelect && typeof this.props.onSelect === 'function')  {
        this.props.onSelect(this.state.selectedOption)
      }
    })
    this.props.setValue(option)
  }

  render() {
    const { options, theme } = this.props
    const { selectedOption } = this.state
    let selectedValue = selectedOption.title

    const renderOption1 = (option, optIdx) => {
      const handleOptionClick = this.handleClick.bind(this, option)
      return (
        <li key={ optIdx } className="dropdown-menu-list-item" onClick={ handleOptionClick }>
          <a href="javascript:;">{ option.title }</a>
        </li>
      )
    }
    const renderOption = (option, optIdx) => {
      return (
        <option key={ optIdx } className="dropdown-menu-list-item">
          { option.title }
        </option>
      )
    }
    const handleOptionClick = this.handleClick.bind(this)
    return (
      <div className="SelectDropdown">
        <select onChange={handleOptionClick} ref={ (select) => {this.select = select} }>
            { options.map(renderOption) }
        </select>
      </div>
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
