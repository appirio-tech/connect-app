import React from 'react'
import ReactSelect from '../Select/Select'
import FormsySelect from '../Select/FormsySelect'
import PropTypes from 'prop-types'
import _ from 'lodash'

/**
 * TagSelect renders the tag selection component for attachment options dialog
 */
export const TagSelect = ({ selectedTags, onUpdate, useFormsySelect, name }) => {
  const noOptionsMessage = evt => {
    const inputValue = evt.inputValue && evt.inputValue.trim()
    if (inputValue === '') {
      return 'Start typing to create a new tag'
    } else if (selectedTags && selectedTags.includes(inputValue)) {
      return 'Tag already selected'
    }
  }

  const isValidNewOption = inputValue => {
    return inputValue && !!inputValue.trim()
  }

  const getNewOptionData = (inputValue, label) => {
    return {
      label,
      value: inputValue.trim()
    }
  }

  const onInputChange = (value) => {
    // prevent preceding spaces
    return _.trimStart(value)
  }

  return (
    <div className="has-react-select">
      {
        useFormsySelect ?
          <FormsySelect
            isMulti
            heightAuto
            name={name}
            setValueOnly
            closeMenuOnSelect
            createOption
            showDropdownIndicator={false}
            placeholder="Add tags"
            onInputChange={onInputChange}
            noOptionsMessage={noOptionsMessage}
            isValidNewOption={isValidNewOption}
            getNewOptionData={getNewOptionData}
          /> :
          <ReactSelect
            isMulti
            heightAuto
            name={name}
            closeMenuOnSelect
            createOption
            showDropdownIndicator={false}
            placeholder="Add tags"
            value={(selectedTags || []).map(t => ({ value: t, label: t }))}
            onChange={tags => onUpdate(tags.map(t => t.value))}
            onInputChange={onInputChange}
            noOptionsMessage={noOptionsMessage}
            isValidNewOption={isValidNewOption}
            getNewOptionData={getNewOptionData}
          />
      }

    </div>
  )
}

TagSelect.propTypes = {
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  onUpdate: PropTypes.func,
  useFormsySelect: PropTypes.bool,
  name: PropTypes.string
}