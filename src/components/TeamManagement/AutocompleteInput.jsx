import React from 'react'
import PropTypes from 'prop-types'
import {findIndex} from 'lodash'
import Select from '../Select/Select'
import './AutocompleteInput.scss'
import {loadMemberSuggestions} from '../../api/projectMembers'
import {AUTOCOMPLETE_TRIGGER_LENGTH} from '../../config/constants'

/**
 * Render a searchable dropdown for selecting users that can be invited
 */
const AutocompleteInput = ({
  onUpdate,
  placeholder,
  selectedMembers,
  disabled,
  allMembers,
}) => {
  const onChange = (inputValue, selectedOptions = []) => {

    if (onUpdate) {
      onUpdate(selectedOptions)
    }
  }

  const asyncOptions = (input) => {
    const value =  typeof input === 'string' ? input : ''
    const createOption = {
      handle: value,
      // Decide if it's email
      isEmail: (/(.+)@(.+){2,}\.(.+){2,}/).test(value),
    }
    if (value.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
      return loadMemberSuggestions(value).then(r => {
        // Remove current members from suggestions
        const suggestions = r.filter(suggestion => (
          findIndex(allMembers, (member) => member.handle === suggestion.handle) === -1 &&
          // Remove current value from list to add it manually on top
          suggestion.handle !== value
        ))
        // Only allow creation if it is not already exists in members
        const shouldIncludeCreateOption = findIndex(allMembers, (member) => member.handle === value) === -1

        return Promise.resolve({options: shouldIncludeCreateOption?[createOption, ...suggestions]: suggestions})
      }).catch( () => {
        return Promise.resolve({options: [createOption] })
      })
    }
    return Promise.resolve({options: value.length > 0 ? [createOption] : []})
  }

  return (
    <div className="autocomplete-wrapper">
      <Select
        multi
        placeholder={placeholder}
        value={selectedMembers}
        onChange={onChange}
        asyncOptions={asyncOptions}
        valueKey="handle"
        labelKey="handle"
        disabled={disabled}
      />
    </div>
  )
}

AutocompleteInput.defaultProps = {
  placeholder: 'Enter one or more user handles',
  selectedMembers: [],
  allMembers: [],
  disabled: false
}

AutocompleteInput.propTypes = {
  /**
   * Callback fired when selected members are updated
   */
  onUpdate: PropTypes.func,

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

  /**
   * List of both current and invited members of project
   */
  allMembers: PropTypes.arrayOf(PropTypes.object)
}


export default AutocompleteInput
