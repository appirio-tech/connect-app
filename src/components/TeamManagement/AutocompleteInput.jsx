import React from 'react'
import PropTypes from 'prop-types'
import {findIndex, find} from 'lodash'
import Select from '../Select/Select'
import './AutocompleteInput.scss'
import {loadMemberSuggestions} from '../../api/projectMembers'
import {AUTOCOMPLETE_TRIGGER_LENGTH} from '../../config/constants'

/**
 * Render a searchable dropdown for selecting users that can be invited
 */
class AutocompleteInput extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.asyncOptions = this.asyncOptions.bind(this)

    this.debounceTimer = null
  }

  // cannot use debounce method from lodash, because we have to return Promise
  loadMemberSuggestionsDebounced(value) {
    return new Promise((resolve) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      this.debounceTimer = setTimeout(() => {
        resolve(loadMemberSuggestions(value))
      }, 500)
    })
  }

  onChange(inputValue, selectedOptions = []) {
    const { onUpdate } = this.props

    if (onUpdate) {
      onUpdate(selectedOptions)
    }
  }

  asyncOptions(input) {
    const { allMembers } = this.props

    const value =  typeof input === 'string' ? input : ''
    const createOption = {
      handle: value,
      // Decide if it's email
      isEmail: (/(.+)@(.+){2,}\.(.+){2,}/).test(value),
    }
    if (value.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
      return this.loadMemberSuggestionsDebounced(value).then(r => {
        const exists = find(r, (member) => member.handle === value)
        if(exists) createOption.userId = exists.userId
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

  render() {
    const {
      placeholder,
      selectedMembers,
      disabled,
    } = this.props

    return (
      <div className="autocomplete-wrapper">
        <Select
          multi
          placeholder={placeholder}
          value={selectedMembers}
          onChange={this.onChange}
          asyncOptions={this.asyncOptions}
          valueKey="handle"
          labelKey="handle"
          disabled={disabled}
        />
      </div>
    )
  }
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
