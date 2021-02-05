import React, { PropTypes } from 'react'
import _ from 'lodash'
import {HOC as hoc} from 'formsy-react'

import FormsySelect from '../../../../components/Select/FormsySelect'
import {fetchGroups} from '../../../../api/groups'
import {AUTOCOMPLETE_TRIGGER_LENGTH, AUTOCOMPLETE_DEBOUNCE_TIME_MS} from '../../../../config/constants'

import styles from './GroupsField.module.scss'

class GroupsField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      groups: [],
      suggestions: []
    }

    this.updateGroups = this.updateGroups.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    this.updateGroups()
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.value, this.props.value)) {
      this.updateGroups()
    }
  }

  updateGroups() {
    if (this.props.value && this.props.value.length > 0) {
      Promise.all(
        this.props.value
          .map(group => fetchGroups({}, `/${group}`))
      ).then((groups) => groups.map(({data: group}) => ({
        label: group.name,
        value: group.id
      })))
        .then(groups => this.setState({groups}))
        .catch(console.error)
    }
  }

  handleInputChange(inputValue) {
    const debounceFn = _.debounce(() => {
      if (!inputValue) return
      const preparedValue = inputValue.trim()
      if (preparedValue.length < AUTOCOMPLETE_TRIGGER_LENGTH) {
        this.setState({suggestions: []})
        return []
      }
      fetchGroups({ name: inputValue })
        .then(({data}) => data.map(suggestion => ({
          label: suggestion.name,
          value: suggestion.id
        })))
        .then(suggestions => this.setState({suggestions}))
    }, AUTOCOMPLETE_DEBOUNCE_TIME_MS)
    debounceFn()
  }

  handleChange(groups) {
    this.setState({groups, suggestions: []})
    this.props.setValue(groups.map(group => group.value))
    this.props.onChange(groups)
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.fieldName}>Groups Field</div>
        <FormsySelect
          name="groups-field"
          isMulti
          onInputChange={this.handleInputChange}
          onChange={this.handleChange}
          value={this.state.groups}
          options={this.state.suggestions}
        />
      </div>
    )
  }
}

GroupsField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  onChange: PropTypes.func,
}

GroupsField.defaultProps = {
  onChange: () => {}
}

export default hoc(GroupsField)
