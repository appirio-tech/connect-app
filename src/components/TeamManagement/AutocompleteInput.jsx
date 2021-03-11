import React from 'react'
import PropTypes from 'prop-types'
import Select from '../Select/Select'
import './AutocompleteInput.scss'

/**
 * Render a searchable dropdown for selecting users that can be invited
 */
class AutocompleteInput extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    const {
      placeholder,
      selectedMembers,
      createSelectRef,
      disabled,
      onBlur
    } = this.props

    return (
      <div className="autocomplete-wrapper">
        <Select
          isMulti
          onBlur={onBlur}
          closeMenuOnSelect
          createSelectRef={createSelectRef}
          showDropdownIndicator={false}
          createOption
          placeholder={placeholder}
          value={selectedMembers}
          onInputChange={this.props.onInputChange}
          onChange={this.props.onUpdate}
          options={this.props.suggestedMembers}
          disabled={disabled}
        />
      </div>
    )
  }
}

AutocompleteInput.defaultProps = {
  placeholder: 'Enter one or more user handles',
  selectedMembers: [],
  createSelectRef: () => {},
  disabled: false
}

AutocompleteInput.propTypes = {
  /**
   * Callback fired when selected members are updated
   */
  onUpdate: PropTypes.func,

  /**
   * Callback fired when input blur
   */
  onBlur: PropTypes.func,

  /**
   * Callback for pass select Ref to parent component
   */
  createSelectRef : PropTypes.func,

  /**
   * The current logged in user in the app.
   * Used to determinate "You" label and access
   */
  currentUser: PropTypes.object,

  /**
   * Placeholder to show when the input is empty
   */
  placeholder: PropTypes.string,

  /**
   * List of members that are currently selected
   */
  selectedMembers: PropTypes.arrayOf(PropTypes.object),

  /**
   * The flag if component is disabled
   */
  disabled: PropTypes.bool,
}

export default AutocompleteInput
