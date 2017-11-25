import React, { PropTypes } from 'react'
import seeAttachedWrapperField from './SeeAttachedWrapperField'
import { TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

import SpecQuestionList from './SpecQuestionList/SpecQuestionList'
import SpecQuestionIcons from './SpecQuestionList/SpecQuestionIcons'
import SpecFeatureQuestion from './SpecFeatureQuestion'
import ColorSelector from './../../../components/ColorSelector/ColorSelector'
import SelectDropdown from './../../../components/SelectDropdown/SelectDropdown'
import SliderInput from './../../../components/SliderInput/SliderInput'

// HOC for TextareaInput
const SeeAttachedTextareaInput = seeAttachedWrapperField(TCFormFields.Textarea)

// HOC for SpecFeatureQuestion
const SeeAttachedSpecFeatureQuestion = seeAttachedWrapperField(SpecFeatureQuestion, [])

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

const SpecQuestions = ({questions, project, dirtyProject, resetFeatures, showFeaturesDialog, isRequired}) => {

  const renderQ = (q, index) => {
    // let child = null
    // const value =
    const elemProps = {
      name: q.fieldName,
      label: q.label,
      value: _.get(project, q.fieldName, ''),
      required: q.required,
      validations: q.required ? 'isRequired' : null,
      validationError: q.validationError,
      validationErrors: q.validationErrors
    }
    if (q.fieldName === 'details.appDefinition.numberScreens') {
      const p = dirtyProject ? dirtyProject : project
      const screens = _.get(p, 'details.appScreens.screens', [])
      const definedScreens = screens.length
      _.each(q.options, (option) => {
        let maxValue = 0
        const hyphenIdx = option.value.indexOf('-')
        if (hyphenIdx === -1) {
          maxValue = parseInt(option.value)
        } else {
          maxValue = parseInt(option.value.substring(hyphenIdx+1))
        }
        option.disabled = maxValue < definedScreens
        option.errorMessage = (
          <p>
            You've defined more than {option.value} screens.
            <br/>
            Please delete screens to select this option.
          </p>
        )
      })
    }

    let ChildElem = ''
    switch (q.type) {
    case 'see-attached-textbox':
      ChildElem = SeeAttachedTextareaInput
      elemProps.wrapperClass = 'row'
      elemProps.autoResize = true
      elemProps.description = q.description
      elemProps.hideDescription = true
      // child = <SeeAttachedTextareaInput name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'textinput':
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'row'
      // child = <TCFormFields.TextInput name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'numberinput':
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'row'
      elemProps.type = 'number'
      break
    case 'textbox':
      ChildElem = TCFormFields.Textarea
      elemProps.wrapperClass = 'row'
      elemProps.autoResize = true
      if (q.validations) {
        elemProps.validations = q.validations
      }
      // child = <TCFormFields.Textarea name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'radio-group':
      ChildElem = TCFormFields.RadioGroup
      _.assign(elemProps, {wrapperClass: 'row', options: q.options})
      // child = <TCFormFields.RadioGroup name={q.fieldName} label={q.label} value={value} wrapperClass="row" options={q.options} />
      break
    case 'tiled-radio-group':
      ChildElem = TCFormFields.TiledRadioGroup
      _.assign(elemProps, {wrapperClass: 'row', options: q.options, theme: 'dark', tabable: true})
      // child = <TCFormFields.TiledRadioGroup name={q.fieldName} label={q.label} value={value} wrapperClass="row" options={q.options} />
      break
    case 'see-attached-tiled-radio-group':
      ChildElem = TCFormFields.TiledRadioGroup
      _.assign(elemProps, {wrapperClass: 'row', options: q.options, hideDescription: true, description: q.description})
      // child = <TCFormFields.TiledRadioGroup name={q.fieldName} label={q.label} value={value} wrapperClass="row" options={q.options} />
      break
    case 'checkbox-group':
      ChildElem = TCFormFields.CheckboxGroup
      _.assign(elemProps, {options: q.options})
      // child = <TCFormFields.CheckboxGroup name={q.fieldName} label={q.label} value={value} options={q.options} />
      break
    case 'checkbox':
      ChildElem = TCFormFields.Checkbox
      // child = <TCFormFields.Checkbox name={q.fieldName} label={q.label} value={value} />
      break
    case 'see-attached-features':
      ChildElem = SeeAttachedSpecFeatureQuestion
      _.assign(elemProps, {
        resetValue: resetFeatures,
        question: q, showFeaturesDialog,
        hideDescription: true,
        description: q.description
      })
      // child = <SeeAttachedSpecFeatureQuestion name={q.fieldName} value={value} question={q} resetValue={resetFeatures} showFeaturesDialog={showFeaturesDialog} />
      break
    case 'colors':
      ChildElem = ColorSelector
      _.assign(elemProps, { defaultColors: q.defaultColors })
      // child = <ColorSelector name={q.fieldName} defaultColors={q.defaultColors} value={value} />
      break
    case 'select-dropdown':
      ChildElem = SelectDropdown
      _.assign(elemProps, {
        options: q.options,
        theme: 'default'
      })
      break
    case 'slide-radiogroup':
      ChildElem = SliderInput
      _.assign(elemProps, {
        options: q.options,
        min: 0,
        max: q.options.length - 1,
        step: 1,
        included: false
      })
      break
    default:
      ChildElem = <noscript />
    }
    return (
      <SpecQuestionList.Item
        key={index}
        title={q.title}
        icon={getIcon(q.icon)}
        description={q.description}
        required={isRequired}
        hideDescription={elemProps.hideDescription}
      >
        <ChildElem {...elemProps} />
      </SpecQuestionList.Item>
    )
  }

  return (
    <SpecQuestionList>
      {questions.map(renderQ)}
    </SpecQuestionList>
  )
}

SpecQuestions.propTypes = {
  /**
   * Original project object for which questions are to be rendered
   */
  project: PropTypes.object.isRequired,
  /**
   * Dirty project with all unsaved changes
   */
  dirtyProject: PropTypes.object,
  /**
   * Callback to be called when user clicks on Add/Edit Features button in feature picker component
   */
  showFeaturesDialog: PropTypes.func.isRequired,
  /**
   * Call back to be called when user resets features from feature picker.
   * NOTE: It seems it is not used as of now by feature picker component
   */
  resetFeatures: PropTypes.func.isRequired,
  /**
   * Array of questions to be rendered. This comes from the spec template for the product
   */
  questions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SpecQuestions
