import React, { PropTypes } from 'react'
import _ from 'lodash'
import SkillsCheckboxGroup from './SkillsCheckboxGroup'
import Select from '../../../../components/Select/Select'
import './SkillsQuestion.scss'
import { axiosInstance as axios } from '../../../../api/requestInterceptor'
import { TC_API_URL } from '../../../../config/constants'

let cachedOptions

/**
 * If `categoriesMapping` is defined - filter options using selected categories.
 * Otherwise returns all `options`.
 *
 * @param {Object} categoriesMapping  form data and API model categories mapping
 * @param {Array}  selectedCategories selected categories in the form
 * @param {Array}  options            all possible options
 *
 * @returns {Array} available options
 */
const getAvailableOptions = (categoriesMapping, selectedCategories, skillsCategories, options) => {
  let mappedCategories
  if (categoriesMapping) {
    mappedCategories = _.map(selectedCategories, (category) => categoriesMapping[category] ? categoriesMapping[category].toLowerCase() : null)
  }
  if (skillsCategories && skillsCategories.length > 0 && !!skillsCategories[0]) {
    mappedCategories = skillsCategories
  }

  if (mappedCategories) {
    return options.filter(option => _.intersection((option.categories || []).map(c => c.toLowerCase()), mappedCategories).length > 0)
  }
  return options
}

class SkillsQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: cachedOptions || [],
      customOptionValue: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSelectType = this.onSelectType.bind(this)
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
      onSkillsLoaded(options.map((option) => _.pick(option, ['id', 'name'])))
    }
  }

  handleChange(val = []) {
    const { setValue, onChange, name } = this.props
    onChange(name, val)
    setValue(val)
  }

  componentWillUpdate(prevProps) {
    const { categoriesMapping, getValue, onChange, setValue, name } = this.props
    const { options } = this.state
    const prevSelectedCategories = this.getSelectedCategories(prevProps)
    const selectedCategories = this.getSelectedCategories(this.props)

    if (selectedCategories.length !== prevSelectedCategories.length) {
      const currentValues = getValue() || []
      const prevAvailableOptions = getAvailableOptions(categoriesMapping, prevSelectedCategories, prevProps.skillsCategories, options)
      const nextAvailableOptions = getAvailableOptions(categoriesMapping, selectedCategories, this.props.skillsCategories, options)
      const prevValues = currentValues.filter(skill => _.some(prevAvailableOptions, skill))
      const nextValues = currentValues.filter(skill => _.some(nextAvailableOptions, skill))

      if (prevValues.length < nextValues.length) {
        onChange(name, prevValues)
        setValue(prevValues)
      } else if (prevValues.length > nextValues.length) {
        onChange(name, nextValues)
        setValue(nextValues)
      }
    }
  }

  onSelectType(value) {
    const { getValue } = this.props
    const indexOfSpace = value.indexOf(' ')
    const indexOfSemiColon = value.indexOf(';')

    // if user enter ' '  or ';' in the start of the input, we should clean it to not allow
    if (indexOfSpace === 0 || indexOfSemiColon === 0 ) {
      return value.slice(1)
    }

    if (indexOfSemiColon >= 1 ) {
      const newValue = value.replace(';', '').trim()
      const currentValues = getValue()
      if (!_.some(currentValues, v => v && v.name === newValue)) {
        this.handleChange([...currentValues, { name:  newValue}])
        // this is return empty to nullify value post processing
        return ''
      } else {
        // don't allow semicolon for duplicate values
        return value.replace(';', '')
      }
    }

    this.setState({ customOptionValue: value })
  }

  getSelectedCategories(props) {
    const {
      currentProjectData,
      categoriesField,
      skillsCategories,
    } = props
    let selectedCategories = currentProjectData ? _.get(currentProjectData, categoriesField, []) : []
    if (selectedCategories.length === 0 && skillsCategories) {
      selectedCategories = skillsCategories
    }
    return selectedCategories
  }

  render() {
    const {
      isFormDisabled,
      isPristine,
      isValid,
      getErrorMessage,
      validationError,
      disabled,
      categoriesMapping,
      getValue,
      frequentSkills,
      skillsCategories,
    } = this.props
    const { options, customOptionValue } = this.state

    const selectedCategories = this.getSelectedCategories(this.props)

    // if have a mapping for categories, then filter options, otherwise use all options
    const availableOptions = getAvailableOptions(categoriesMapping, selectedCategories, skillsCategories, options)
      .map(option => _.pick(option, ['id', 'name']))

    let currentValues = getValue() || []
    // remove from currentValues not available options but still keep created custom options without id
    currentValues = currentValues.filter(skill => _.some(availableOptions, skill) || !skill.id)

    const questionDisabled = isFormDisabled() || disabled || selectedCategories.length === 0
    const hasError = !isPristine() && !isValid()
    const errorMessage = getErrorMessage() || validationError

    const checkboxGroupOptions = availableOptions.filter(option => frequentSkills.indexOf(option.id) > -1)
    const checkboxGroupValues = currentValues.filter(val => _.some(checkboxGroupOptions, option => option.id === val.id ))

    const selectGroupOptions = availableOptions.filter(option => frequentSkills.indexOf(option.id) === -1)
    if (customOptionValue) {
      selectGroupOptions.unshift({ name: customOptionValue })
    }
    const selectGroupValues = _.reject(currentValues, (val => _.some(checkboxGroupValues, val)))

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
            createOption
            isMulti
            closeMenuOnSelect
            showDropdownIndicator
            isClearable
            isSearchable
            heightAuto
            placeholder="Start typing a skill then select from the list"
            value={selectGroupValues}
            getOptionLabel={(option) => option.name || ''}
            getOptionValue={(option) => (option.name || '').trim()}
            onInputChange={this.onSelectType}
            onChange={(val) => {
              this.handleChange(_.union(val, checkboxGroupValues))
            }}
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
  onChange: () => {},
  skillsCategories: null,
}

SkillsQuestion.PropTypes = {
  skillsCategories: PropTypes.arrayOf(PropTypes.string)
}


export default SkillsQuestion
