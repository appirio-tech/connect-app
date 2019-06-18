import React from 'react'
import _ from 'lodash'
import { HOC as hoc } from 'formsy-react'
import SkillsCheckboxGroup from './SkillsCheckboxGroup'
import Select from '../../../../components/Select/Select'
import './SkillsQuestion.scss'
import { axiosInstance as axios } from '../../../../api/requestInterceptor'
import { TC_API_URL } from '../../../../config/constants'

let cachedOptions

class SkillsQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: cachedOptions || []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    if (!cachedOptions) {
      axios.get(`${TC_API_URL}/v3/tags/?domain=SKILLS&status=APPROVED`)
        .then(resp => {
          const options = _.get(resp.data, 'result.content', {})

          cachedOptions = options
          this.updateOptions(options)
        })
    } else {
      this.updateOptions(cachedOptions)
    }
  }

  updateOptions(options) {
    const { onSkillsLoaded } = this.props

    this.setState({ options })
    if (onSkillsLoaded) {
      onSkillsLoaded(options.map((option) => ({
        title: option.name,
        value: option.id,
      })))
    }
  }

  handleChange(val = []) {
    const { setValue, onChange, name } = this.props
    onChange(name, val)
    setValue(val)
  }

  componentDidUpdate(prevProps) {
    const { categoriesField, categoriesMapping, currentProjectData, getValue, onChange, setValue, name } = this.props
    const { options } = this.state
    const prevSelectedCategories = _.get(prevProps.currentProjectData, categoriesField, [])
    const selectedCategories = _.get(currentProjectData, categoriesField, [])

    if (selectedCategories.length !== prevSelectedCategories.length) {
      const mappedPrevSelectedCategories = _.map(prevSelectedCategories, (category) => categoriesMapping[category] ? categoriesMapping[category].toLowerCase() : null)
      const mappedSelectedCategories = _.map(selectedCategories, (category) => categoriesMapping[category] ? categoriesMapping[category].toLowerCase() : null)

      const currentValues = getValue() || []
      const prevAvailableOptions = options.filter(option => _.intersection(option.categories, mappedPrevSelectedCategories).length > 0)
      const nextAvailableOptions = options.filter(option => _.intersection(option.categories, mappedSelectedCategories).length > 0)
      const prevValues = currentValues.filter(skill => prevAvailableOptions.some(option => option.id === skill))
      const nextValues = currentValues.filter(skill => nextAvailableOptions.some(option => option.id === skill))

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
      categoriesField,
      categoriesMapping,
      getValue,
      frequentSkills
    } = this.props
    const { options } = this.state

    const selectedCategories = _.get(currentProjectData, categoriesField, [])
    const mappedCategories = _.map(selectedCategories, (category) => categoriesMapping[category] ? categoriesMapping[category].toLowerCase() : null)
    const availableOptions = options.filter(option => _.intersection(option.categories, mappedCategories).length > 0)

    let currentValues = getValue() || []
    currentValues = currentValues.filter(skill => availableOptions.some(option => option.id === skill))

    const questionDisabled = isFormDisabled() || disabled || selectedCategories.length === 0
    const hasError = !isPristine() && !isValid()
    const errorMessage = getErrorMessage() || validationError

    const checkboxGroupOptions = availableOptions.filter(option => frequentSkills.indexOf(option.id) > -1).map(
      option => ({
        title: option.name,
        value: option.id,
      })
    )
    const checkboxGroupValues = currentValues.filter(val => _.some(checkboxGroupOptions, option => option.value === val ))
    const selectGroupOptions =
      availableOptions.filter(option => frequentSkills.indexOf(option.id) === -1).map(
        option => Object.assign({}, option, { value: option.id }))
    const selectGroupValues = currentValues.filter(val => _.some(selectGroupOptions, option => option.id === val ))

    return (
      <div>
        <SkillsCheckboxGroup
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
            value={selectGroupOptions.filter(option => selectGroupValues.some(val => option.id=== val))}
            getOptionLabel={(option) => option.name}
            onChange={(val) => { this.handleChange(_.union(val.map(val => val.id), checkboxGroupValues)) }}
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

SkillsQuestion.defaultProps = {
  onChange: () => {}
}

export default hoc(SkillsQuestion)
