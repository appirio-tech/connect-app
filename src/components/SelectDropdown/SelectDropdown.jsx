import _ from 'lodash'
import React, { Component } from 'react'
import cn from 'classnames'
import PT from 'prop-types'
import { HOC as hoc } from 'formsy-react'
import Dropdown from 'appirio-tech-react-components/components/Dropdown/Dropdown'
import Modal from 'react-modal'

import './SelectDropdown.scss'

class SelectDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: null,
      confirmOption: null,
    }

    this.cancelSelectOption = this.cancelSelectOption.bind(this)
    this.confirmSelectOption = this.confirmSelectOption.bind(this)
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
    if (!option.confirm) {
      this.selectOption(option)
    } else {
      this.showConfirmOption(option)
    }
  }

  showConfirmOption(option) {
    this.setState({
      confirmOption: option,
    })
  }

  cancelSelectOption() {
    this.setState({
      confirmOption: null,
    })
  }

  confirmSelectOption() {
    this.selectOption(this.state.confirmOption)
    this.setState({
      confirmOption: null,
    })
  }

  selectOption(option) {
    this.setState({ selectedOption : option }, function() {
      if (this.props.onSelect && typeof this.props.onSelect === 'function')  {
        this.props.onSelect(this.state.selectedOption)
      }
    })
    this.props.setValue(option.value)
  }

  render() {
    const { options, theme, disabled } = this.props
    const { selectedOption, confirmOption } = this.state
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
      <div styleName="container">
        {disabled ? (
          <div className="SelectDropdown" styleName="dropdown-disabled">
            <div className="dropdown-menu-header"><span className="tc-link">{ selectedValue }</span></div>
          </div>
        ) : (
          <Dropdown theme={ theme } className="SelectDropdown" noPointer>
            <div className="dropdown-menu-header"><span className="tc-link">{ selectedValue }</span></div>
            <ul className="dropdown-menu-list">
              { options.map(renderOption) }
            </ul>
          </Dropdown>
        )}

        <Modal
          isOpen={!!confirmOption}
          className="delete-post-dialog"
          overlayClassName="delete-post-dialog-overlay"
          onRequestClose={this.cancelSelectOption}
          contentLabel=""
        >
          <div className="modal-title">
            {!!confirmOption && confirmOption.confirm}
          </div>

          <div className="button-area flex center action-area">
            <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={this.cancelSelectOption}>Cancel</button>
            <button className="tc-btn tc-btn-warning tc-btn-sm action-btn " onClick={this.confirmSelectOption}>Confirm</button>
          </div>
        </Modal>
      </div>
    )
  }
}

SelectDropdown.propTypes = {
  onSelect       : PT.func,
  options        : PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    value: PT.string.isRequired,
    disabled: PT.bool,
    confirm: PT.oneOfType([PT.string, PT.bool]),
  })).isRequired,
  theme          : PT.string,
  selectedOption : PT.object
}

export default hoc(SelectDropdown)
