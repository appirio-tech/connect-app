import React, { PropTypes } from 'react'
import _ from 'lodash'
import SkillsCheckboxGroup from './SkillsCheckboxGroup'
import Select from '../../../../components/Select/Select'
import './SkillsQuestion.scss'
import { createFilter } from 'react-select'
import { getSkills } from '../../../../api/skills'

/**
 * If `categoriesMapping` is defined - filter options using selected categories.
 * Otherwise returns all `options`.
 *
 * @param {Object} categoriesMapping  form data and API model categories mapping
 * @param {Array}  selectedCategories selected categories in the form
 * @param {Array}  skillsCategories categories of field, use for filter
 * @param {Array}  options            all possible options
 *
 * @returns {Array} available options
 */
const getAvailableOptions = (categoriesMapping, selectedCategories, skillsCategories, options) => {
  // NOTE:
  // Disable filtering skills by categories for now, because V5 Skills API doesn't have categories for now.
  /*
  let mappedCategories
  if (categoriesMapping) {
    mappedCategories = _.map(selectedCategories, (category) => categoriesMapping[category] ? categoriesMapping[category].toLowerCase() : null)
  } else if (skillsCategories) {
    mappedCategories = skillsCategories
  }

  if (mappedCategories) {
    return options.filter(option => _.intersection((option.categories || []).map(c => c.toLowerCase()), mappedCategories).length > 0)
  }
  */
  return options
}

class SkillsQuestion extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      availableOptions: [],
      customOptionValue: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSelectType = this.onSelectType.bind(this)
  }

  componentWillMount() {
    getSkills().then(skills => {
      const options = skills.map(skill => ({
        skillId: skill.id,
        name: skill.name
      }))
      this.updateOptions(options)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.categoriesMapping !== this.props.categoriesMapping ||
      nextProps.skillsCategories !== this.props.skillsCategories ||
      nextProps.currentProjectData !== this.props.currentProjectData ||
      nextProps.categoriesField !== this.props.categoriesField
    ) {
      this.updateAvailableOptions(nextProps, this.state.options)
    }
  }

  updateOptions(options) {
    const { onSkillsLoaded } = this.props

    this.setState({ options })
    this.updateAvailableOptions(this.props, options)
    if (onSkillsLoaded) {
      onSkillsLoaded(options.map((option) => _.pick(option, ['id', 'name'])))
    }
  }

  updateAvailableOptions(props, options) {
    const {
      categoriesMapping,
      skillsCategories,
      currentProjectData,
      categoriesField,
    } = props

    const selectedCategories = _.get(currentProjectData, categoriesField, [])

    // if have a mapping for categories, then filter options, otherwise use all options
    const availableOptions = getAvailableOptions(categoriesMapping, selectedCategories, skillsCategories, options)
      .map(option => _.pick(option, ['id', 'name']))
    this.setState({ availableOptions })
  }

  handleChange(val = []) {
    const { setValue, onChange, name } = this.props
    onChange(name, val)
    setValue(val)
  }

  componentWillUpdate(prevProps) {
    const { categoriesMapping, getValue, onChange, setValue, name, currentProjectData, categoriesField } = this.props
    const { options } = this.state
    const prevSelectedCategories = _.get(prevProps.currentProjectData, categoriesField, [])
    const selectedCategories = _.get(currentProjectData, categoriesField, [])

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
    const { availableOptions } = this.state
    const correspondingOption = availableOptions.find(option => {
      return option.name.trim().toLowerCase()===value.replace(';', '').trim().toLowerCase()
    })
    const isInAvailableOptions = !!correspondingOption
    const indexOfSpace = value.indexOf(' ')
    const indexOfSemiColon = value.indexOf(';')

    // if user enter ' '  or ';' in the start of the input, we should clean it to not allow
    if (indexOfSpace === 0 || indexOfSemiColon === 0 ) {
      return value.slice(1)
    }
    if (indexOfSemiColon >= 1 ) {
      const newValue = value.replace(';', '').trim()
      const currentValues = getValue()
      if (!_.some(currentValues, v => v && v.name.trim().toLowerCase() === newValue.trim().toLowerCase())) {
        if(isInAvailableOptions) {
          this.handleChange([...currentValues, correspondingOption])
          this.setState({ customOptionValue: '' })
        } else {
          this.handleChange([...currentValues, { name:  newValue}])
        }
        // this is return empty to nullify value post processing
        return ''
      } else {
        // don't allow semicolon for duplicate values
        return value.replace(';', '')
      }
    }
    if (!isInAvailableOptions) {
      this.setState({ customOptionValue: value })
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
      getValue,
      frequentSkills,
      skillsCategories,
      currentProjectData,
      categoriesField,
      selectWrapperClass,
    } = this.props
    const { availableOptions, customOptionValue } = this.state

    const selectedCategories = _.get(currentProjectData, categoriesField, [])

    let currentValues = getValue() || []
    // remove from currentValues not available options but still keep created custom options without id
    currentValues = currentValues.filter(skill => _.some(availableOptions, skill) || !skill.id)

    const questionDisabled = isFormDisabled() || disabled || (selectedCategories.length === 0 && _.isUndefined(skillsCategories))
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
        {checkboxGroupOptions.length > 0 ? (
          <SkillsCheckboxGroup
            disabled={questionDisabled}
            options={checkboxGroupOptions}
            getValue={() => checkboxGroupValues}
            setValue={(val) => { this.handleChange(_.union(val, selectGroupValues)) }}
          />) : null}
        <div styleName="select-wrapper" className={selectWrapperClass}>
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
            filterOption={createFilter({ ignoreAccents: false })}
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
  frequentSkills: []
}

SkillsQuestion.PropTypes = {
  skillsCategories: PropTypes.arrayOf(PropTypes.string),
  selectWrapperClass: PropTypes.string
}


export default SkillsQuestion
