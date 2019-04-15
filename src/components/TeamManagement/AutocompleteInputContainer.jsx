import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import AutocompleteInput from './AutocompleteInput'
import {memberSuggestionsDispatch, clearMemberSuggestions} from '../../projects/actions/projectMember'
import {AUTOCOMPLETE_TRIGGER_LENGTH} from '../../config/constants'

class AutocompleteInputContainer extends React.Component {

  constructor(props) {
    super(props)
    this.debounceTimer = null
  }

  onInputChange(inputValue) {
    const indexOfSpace = inputValue.indexOf(' ')
    const indexOfSemiColon = inputValue.indexOf(';')

    // if user enter only ' '  or ';' we should clean it to not allow
    if (indexOfSpace === 0 || indexOfSemiColon === 0 ) {
      return ''
    }

    if (indexOfSpace >= 1 || indexOfSemiColon >= 1 ) {
      inputValue = inputValue.substring(0, inputValue.length -1 )
      this.onUpdate([...this.props.selectedMembers, {label: inputValue, value: inputValue}])
      this.props.onClearUserSuggestions()
      // this is return empty to nullify inputValue post processing
      return ''
    }

    if (inputValue.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
      this.props.onLoadUserSuggestions(inputValue)
    } else {
      this.props.onClearUserSuggestions()
    }
  }

  onUpdate(inputValue) {
    const inputValueNormalized = inputValue.map(value => ({
      ...value,
      isEmail: (/(.+)@(.+){2,}\.(.+){2,}/).test(value.label)
    }))

    if (this.props.onUpdate) {
      this.props.onUpdate(inputValueNormalized)
    }
    this.props.onClearUserSuggestions()
  }

  render() {

    const { placeholder, currentUser, selectedMembers, disabled } = this.props

    return (
      <AutocompleteInput
        placeholder={placeholder ? placeholder:''}
        onInputChange={this.onInputChange.bind(this)}
        onUpdate={this.onUpdate.bind(this)}
        suggestedMembers={this.props.suggestedMembers}
        currentUser={currentUser}
        selectedMembers={selectedMembers}
        disabled={disabled}
      />
    )
  }
}

const mapStateToProps = (reduxstore) => {
  return {
    suggestedMembers: reduxstore.members.suggestedMembers
      .map(suggestion => {
        return {
          label: suggestion.handle, value: suggestion.handle
        }
      })
  }
}

const mapDispatchToProps = (dispatch) => {
  const debouncedDispatcher = _.debounce((arg) => memberSuggestionsDispatch(dispatch)(arg), 500, {leading: true})
  return {
    onLoadUserSuggestions: (value) => {
      debouncedDispatcher(value)
    },
    onClearUserSuggestions: () => {
      clearMemberSuggestions(dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteInputContainer)
