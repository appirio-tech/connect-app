import React from 'react'
import ReactSelect from '../Select/Select'
import FormsySelect from '../Select/FormsySelect'
import PropTypes from 'prop-types'

/**
 * TagSelect renders the tag selection component for attachment options dialog
 */
export const TagSelect = ({ selectedTags, onUpdate, useFormsySelect, name }) => {
  const noOptionsMessage = evt => {
    if (evt.inputValue === '') {
      return 'Start typing to create a new tag'
    } else if (selectedTags && selectedTags.includes(evt.inputValue)) {
      return 'Tag already selected'
    }
  }

  return (
    <div>
      {
        useFormsySelect ?
          <FormsySelect
            isMulti
            name={name}
            setValueOnly
            closeMenuOnSelect
            createOption
            showDropdownIndicator={false}
            placeholder="Add tags"
            noOptionsMessage={noOptionsMessage}
          /> :
          <ReactSelect
            isMulti
            name={name}
            closeMenuOnSelect
            createOption
            showDropdownIndicator={false}
            placeholder="Add tags"
            value={(selectedTags || []).map(t => ({ value: t, label: t }))}
            onChange={tags => onUpdate(tags.map(t => t.value))}
            noOptionsMessage={noOptionsMessage}
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