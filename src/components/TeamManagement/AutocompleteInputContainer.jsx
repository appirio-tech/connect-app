import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import AutocompleteInput from './AutocompleteInput'
import {loadMemberSuggestions, clearMemberSuggestions} from '../../projects/actions/projectMember'
import {AUTOCOMPLETE_TRIGGER_LENGTH} from '../../config/constants'

class AutocompleteInputContainer extends React.Component {

  constructor(props) {
    super(props)
    this.debounceTimer = null
  }

  onInputChange(inputValue) {
    if (inputValue.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
      this.props.onLoadUserSuggestions(inputValue)
    } else {
      this.props.onClearUserSuggestions()
    }
  }

  onUpdate(inputValue) {
    if (this.props.onUpdate) {
      this.props.onUpdate(inputValue)
    }
    this.props.onClearUserSuggestions()
  }

  render() {

    const { placeholder, currentUser, selectedMembers, disabled, allMembers} = this.props

    return (
      <AutocompleteInput
        placeholder={placeholder ? placeholder:''}
        onInputChange={this.onInputChange.bind(this)}
        onUpdate={this.onUpdate.bind(this)}
        suggestedMembers={this.props.suggestedMembers}
        currentUser={currentUser}
        selectedMembers={selectedMembers}
        disabled={disabled}
        allMembers={allMembers}
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
  return {
    onLoadUserSuggestions: (value) => {
	  _.debounce(()=>loadMemberSuggestions(value)(dispatch), 500, {leading: true})()
      // if (this.debounceTimer) {
      //   clearTimeout(this.debounceTimer)
      // }
      // this.debounceTimer = setTimeout(() => {
      //   loadMemberSuggestions(value)(dispatch)
      // }, 500)
    },
    onClearUserSuggestions: () => {
      clearMemberSuggestions(dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteInputContainer)
