import React from 'react'
import { connect } from 'react-redux'

import AutocompleteInput from './AutocompleteInput'
import {loadMemberSuggestions} from '../../projects/actions/projectMember'
import {AUTOCOMPLETE_TRIGGER_LENGTH} from '../../config/constants'

class AutocompleteInputContainer extends React.Component {

  constructor(props) {
    super(props)
    this.debounceTimer = null
  }

  onInputChange(inputValue) {
    if (inputValue.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
      this.props.onLoadUserSuggestions(inputValue)
    }
  }

  render() {

    const { placeholder, currentUser, selectedMembers, disabled, allMembers} = this.props

    return (
      <AutocompleteInput
        placeholder={placeholder ? placeholder:''}
        onInputChange={this.onInputChange.bind(this)}
        onUpdate={this.props.onUpdate?this.props.onUpdate:() => {}}
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
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      this.debounceTimer = setTimeout(() => {
        loadMemberSuggestions(value)(dispatch)
      }, 500)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteInputContainer)
