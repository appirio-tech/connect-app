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

    const renderOption = (option, optIdx) => {
      const handleOptionClick = this.handleClick.bind(this, option)
      return (
        <li key={ optIdx } className="dropdown-menu-list-item" onClick={ handleOptionClick }>
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
