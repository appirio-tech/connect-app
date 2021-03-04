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
    this.selectInstance = null

    this.clearUserSuggestions = this.clearUserSuggestions.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.createSelectRef = this.createSelectRef.bind(this)
  }

  /**
   * Clear user suggestion list
   */
  clearUserSuggestions() {
    const { showSuggestions } = this.props

    if (!showSuggestions) {
      // When we don't show suggestions, we should not clean them
      this.props.onClearUserSuggestions()
    }
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
      this.clearUserSuggestions()
      // this is return empty to nullify inputValue post processing
      return ''
    }

    if (inputValue.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
      // When user doesn't have permissions to retrieve suggestions should not try to show suggestions as we always get error 403
      if (this.props.showSuggestions) {
        this.props.onLoadUserSuggestions(inputValue)
      }
    } else {
      this.clearUserSuggestions()
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
    this.clearUserSuggestions()
  }

  handleInputBlur() {
    const innerSelectInstance = this.selectInstance.select.select
    const focusedOption = innerSelectInstance.state.focusedOption
    // current input value
    const inputValue =  this.selectInstance.state.inputValue
    if (inputValue && focusedOption) {
      innerSelectInstance.selectOption(focusedOption)
    }
  }

  createSelectRef(ref) {
    this.selectInstance = ref
  }

  render() {

    const { placeholder, currentUser, selectedMembers, disabled } = this.props

    return (
      <AutocompleteInput
        createSelectRef={this.createSelectRef}
        placeholder={placeholder ? placeholder:''}
        onBlur={this.handleInputBlur}
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
