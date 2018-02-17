require('./SelectDropdown.scss')

import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { HOC as hoc } from 'formsy-react'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'

class SelectDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = _.assign(this.state, { selectedOption : null })
  }

  componentWillMount() {
    let selectedOption = _.find(this.props.options, (o) => o.value === this.props.value)
    if (!selectedOption) {
      selectedOption = this.props.options[0]
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
