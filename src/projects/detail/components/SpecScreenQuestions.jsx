import React, { PropTypes } from 'react'
import { TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

import SpecQuestionList from './SpecQuestionList/SpecQuestionList'
import SpecQuestionIcons from './SpecQuestionList/SpecQuestionIcons'
import ColorSelector from './../../../components/ColorSelector/ColorSelector'
import SelectDropdown from './../../../components/SelectDropdown/SelectDropdown'

const getIcon = icon => {
  switch (icon) {
  case 'feature-generic':
    return <SpecQuestionIcons.Generic />
  case 'question':
    return <SpecQuestionIcons.Question />
  case 'feature-placeholder':
  default:
    return <SpecQuestionIcons.Placeholder />
  }
}

const SpecScreenQuestions = ({questions, screen}) => {

  const renderQ = (q, index) => {
    const elemProps = {
      name: q.fieldName,
      label: q.label,
      value: _.get(screen, q.fieldName, undefined),
      validationError: q.validationError,
      validations: q.validations
    }
    let ChildElem = ''
    switch (q.type) {
    case 'textinput':
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'row'
      break
    case 'textbox':
      ChildElem = TCFormFields.Textarea
      elemProps.wrapperClass = 'row'
      elemProps.autoResize = true
      break
    case 'radio-group':
      ChildElem = TCFormFields.RadioGroup
      _.assign(elemProps, {wrapperClass: 'row', options: q.options})
      break
    case 'tiled-radio-group':
      ChildElem = TCFormFields.TiledRadioGroup
      _.assign(elemProps, {wrapperClass: 'row', options: q.options})
      break
    case 'checkbox-group':
      ChildElem = TCFormFields.CheckboxGroup
      _.assign(elemProps, {options: q.options})
      break
    case 'checkbox':
      ChildElem = TCFormFields.Checkbox
      break
    case 'colors':
      ChildElem = ColorSelector
      _.assign(elemProps, { defaultColors: q.defaultColors })
      break
    case 'select-dropdown': {
      ChildElem = SelectDropdown
      const importanceLevel = _.get(screen, 'importanceLevel')
      _.assign(elemProps, {
        options: q.options,
        theme: 'default',
        // overrides value to be backward compatible when it used to save full option object as selected value
        // now it saves only the value of the selected option
        value: importanceLevel.value ? importanceLevel.value : importanceLevel
      })
      break
    }
    default:
      ChildElem = <noscript />
    }
    return (
      <SpecQuestionList.Item
        key={index}
        title={q.title}
        icon={getIcon(q.icon)}
        description={q.description}
        required={q.required}
      >
        <ChildElem {...elemProps} required/>
      </SpecQuestionList.Item>
    )
  }

  return (
    <SpecQuestionList>
      {questions.map(renderQ)}
    </SpecQuestionList>
  )
}

SpecScreenQuestions.propTypes = {
  screen: PropTypes.object.isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SpecScreenQuestions
