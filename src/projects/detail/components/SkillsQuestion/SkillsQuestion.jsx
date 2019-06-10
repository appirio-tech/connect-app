import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { HOC as hoc } from 'formsy-react'
import CheckboxGroup from './CheckboxGroup'
import Select from '../../../../components/Select/Select'
import './SkillsQuestion.scss'

class SkillsQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(val = []) {
    const { setValue, onChange, name } = this.props
    onChange(name, val)
    setValue(val)
  }

  componentDidUpdate(prevProps) {
    const { skillsCategoriesField, currentProjectData, options, getValue, onChange, setValue, name } = this.props
    const prevSelectedCategories = _.get(prevProps.currentProjectData, skillsCategoriesField, [])
    const selectedCategories = _.get(currentProjectData, skillsCategoriesField, [])

    if (selectedCategories.length !== prevSelectedCategories.length) {
      const currentValues = getValue() || []
      const prevAvailableOptions = options.filter(option => _.intersection(option.categories, prevSelectedCategories).length > 0)
      const nextAvailableOptions = options.filter(option => _.intersection(option.categories, selectedCategories).length > 0)
      const prevValues = currentValues.filter(skill => prevAvailableOptions.some(option => option.value === skill))
      const nextValues = currentValues.filter(skill => nextAvailableOptions.some(option => option.value === skill))

      if (prevValues.length < nextValues.length) {
        onChange(name, prevValues)
        setValue(prevValues)
      } else if (prevValues.length > nextValues.length) {
        onChange(name, nextValues)
        setValue(nextValues)
      }
    }
  }

  render() {
    const {
      isFormDisabled,
      isPristine,
      isValid,
      getErrorMessage,
      validationError,
      disabled,
      currentProjectData,
      skillsCategoriesField,
      options,
      getValue
    } = this.props

    const selectedCategories = _.get(currentProjectData, skillsCategoriesField, [])
    const availableOptions = options.filter(option => _.intersection(option.categories, selectedCategories).length > 0)
    let currentValues = getValue() || []
    currentValues = currentValues.filter(skill => availableOptions.some(option => option.value === skill))

    const questionDisabled = isFormDisabled() || disabled || selectedCategories.length === 0
    const hasError = !isPristine() && !isValid()
    const errorMessage = getErrorMessage() || validationError

    const checkboxGroupOptions = availableOptions.filter(option => option.isFrequent)
    const checkboxGroupValues = currentValues.filter(val => _.some(checkboxGroupOptions, option => option.value === val ))
    const selectGroupOptions = availableOptions.filter(option => !option.isFrequent)
    const selectGroupValues = currentValues.filter(val => _.some(selectGroupOptions, option => option.value === val ))

    return (
      <div>
        <CheckboxGroup
          disabled={questionDisabled}
          options={checkboxGroupOptions}
          getValue={() => checkboxGroupValues}
          setValue={(val) => { this.handleChange(_.union(val, selectGroupValues)) }}
        />
        <div styleName="select-wrapper">
          <Select
            isMulti
            closeMenuOnSelect
            showDropdownIndicator
            isClearable
            isSearchable
            heightAuto
            placeholder="Start typing a skill then select from the list"
            value={selectGroupOptions.filter(option => selectGroupValues.some(val => option.value === val))}
            getOptionLabel={(option) => option.title}
            onChange={(val) => { this.handleChange(_.union(val.map(val => val.value), checkboxGroupValues)) }}
            noOptionsMessage={() => 'No results found'}
            options={selectGroupOptions}
            isDisabled={questionDisabled}
          />
        </div>
        { hasError && (<p styleName="error-message">{errorMessage}</p>) }
      </div>
    )
  }
}

SkillsQuestion.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired
}

SkillsQuestion.defaultProps = {
  onChange: () => {}
}

export default hoc(SkillsQuestion)
