import React from 'react'
import PropTypes from 'prop-types'
import seeAttachedWrapperField from './SeeAttachedWrapperField'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
import _ from 'lodash'
import AddonOptions from './AddonOptions/AddonOptions'

import SpecQuestionList from './SpecQuestionList/SpecQuestionList'
import SpecQuestionIcons from './SpecQuestionList/SpecQuestionIcons'
import SpecFeatureQuestion from './SpecFeatureQuestion'
import ColorSelector from './../../../components/ColorSelector/ColorSelector'
import SelectDropdown from './../../../components/SelectDropdown/SelectDropdown'

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

const filterAddonQuestions = (productTemplates, question) =>
  productTemplates.filter(
    d =>
      d.category === question.category &&
      question.subCategories.includes(d.subCategory)
  )
const formatAddonOptions = options => options.map(o => ({
  label: o.name,
  value: { id: o.id },
}))

// { isRequired, represents the overall questions section's compulsion, is also available}
const SpecQuestions = ({
  questions,
  layout,
  additionalClass,
  project,
  dirtyProject,
  resetFeatures,
  showFeaturesDialog,
  showHidden,
  startEditReadOnly,
  stopEditReadOnly,
  cancelEditReadOnly,
  isProjectDirty,
  productTemplates,
}) => {
  const currentProjectData = isProjectDirty ? dirtyProject : project

  const renderQ = (q, index) => {
    const isReadOnly = _.get(q, '__wizard.readOnly')
    // let child = null
    // const value =
    const elemProps = {
      name: q.fieldName,
      label: q.label,
      value: _.get(project, q.fieldName, ''),
      required: q.required,
      validations: q.required ? 'isRequired' : null,
      validationError: q.validationError,
      validationErrors: q.validationErrors,
      disabled: isReadOnly
    }
    if (q.options) {
      // don't show options which are hidden by conditions
      q.options = q.options.filter((option) => !_.get(option, '__wizard.hiddenByCondition'))
      // disable options if they are disabled by conditions
      q.options.forEach((option) => {
        if (_.get(option, '__wizard.disabledByCondition', false)) {
          option.disabled = true
        }
      })

      if (elemProps.disabled) {
        const fieldValue = _.get(currentProjectData, q.fieldName)
        if (q.type === 'radio-group') {
          q.options = _.filter(q.options, { value: fieldValue})
        } else if (q.type === 'checkbox-group') {
          q.options = _.filter(q.options, (option) => (
            _.includes(fieldValue, option.value)
          ))
        }
      }
    }
    // escape value of the question only when it is of string type
    if (typeof elemProps.value === 'string') {
      elemProps.value = _.unescape(elemProps.value)
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

    let additionalItemClass = ''
    const spacing = _.get(q, 'spacing', '')

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
      elemProps.wrapperClass = 'row ' + spacing
      if (spacing.includes('spacing-gray-input')) {
        elemProps.placeholder = q.title
      }
      additionalItemClass = spacing
      // child = <TCFormFields.TextInput name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'numberinput':
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'row'
      elemProps.type = 'number'
      break
    case 'numberinputpositive':
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'rowchut'
      elemProps.type = 'number'
      elemProps.minValue = 0
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
      _.assign(elemProps, {options: q.options, layout: q.layout })
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
      ChildElem = TCFormFields.SliderRadioGroup
      _.assign(elemProps, {
        options: q.options,
        min: 0,
        max: q.options.length - 1,
        step: 1,
        included: false
      })
      break
    case 'add-ons':
      ChildElem = AddonOptions
      _.assign(elemProps, { options: formatAddonOptions(filterAddonQuestions(productTemplates, q)) })
      break
    default:
      ChildElem = <noscript />
    }
    // let titleAside = null
    let textValue = null
    let shouldHideFormField = false

    // if field is readOnly we will hide some real form fields and show their values as text
    // for easier reading
    if (isReadOnly) {
      switch(q.type) {
      case 'radio-group': {
        const option = _.find(q.options, {value: _.get(currentProjectData, q.fieldName)})
        // titleAside = _.get(option, 'label')
        textValue = _.get(option, 'label')
        shouldHideFormField = true
        break
      }
      case 'tiled-radio-group' : {
        const option = _.find(q.options, {value: _.get(currentProjectData, q.fieldName)})
        // titleAside = _.get(option, 'title')
        textValue = _.get(option, 'title')
        shouldHideFormField = true
        break
      }
      case 'checkbox-group': {
        const values = _.get(currentProjectData, q.fieldName)
        const options = _.filter(q.options, (option) => (
          _.includes(values, option.value)
        ))
        textValue = _.map(options, 'label').join(', ')
        shouldHideFormField = true
        break
      }
      case 'add-ons': {
        const values = _.get(currentProjectData, q.fieldName)
        const options = _.filter(elemProps.options, (option) => (
          _.find(values, { id: _.get(option, 'value.id') })
        ))
        textValue = _.map(options, 'label').join(', ')
        shouldHideFormField = true
        break
      }
      }
    }

    return (
      <SpecQuestionList.Item
        additionalClass = {additionalItemClass}
        key={index}
        title={q.title}
        type={q.type}
        // titleAside={titleAside}
        icon={getIcon(q.icon)}
        description={!isReadOnly ? q.description : null}
        required={q.required || (q.validations && q.validations.indexOf('isRequired') !== -1)}
        hideDescription={elemProps.hideDescription}
        __wizard={q.__wizard}
        startEditReadOnly={startEditReadOnly}
        stopEditReadOnly={stopEditReadOnly}
        cancelEditReadOnly={cancelEditReadOnly}
        readOptimized={shouldHideFormField}
      >
        <div style={shouldHideFormField ? {display: 'none'} : {}}>
          <ChildElem {...elemProps} />
        </div>
        {textValue && <div className="spec-section-readonly-text-value">{textValue}</div>}
      </SpecQuestionList.Item>
    )
  }

  return (
    <SpecQuestionList layout={layout} additionalClass={additionalClass}>
      {questions.filter((question) =>
        // hide if we are in a wizard mode and question is hidden for now
        (!_.get(question, '__wizard.hidden')) &&
        // hide if question is hidden by condition
        (!_.get(question, '__wizard.hiddenByCondition')) &&
        // hide hidden questions, unless we not force to show them
        (showHidden || !question.hidden)
      ).map(renderQ)}
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
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If true, then `hidden` property of questions will be ignored and hidden questions will be rendered
   */
  showHidden: PropTypes.bool,
  /**
   * Layout of questions
   */
  layout: PropTypes.object,

  /**
   * additional class
   */
  additionalClass: PropTypes.string,

  /**
   * contains the productTypes required for rendering add-on type questions
   */
  productTemplates: PropTypes.array.isRequired,
}

SpecQuestions.defaultProps = {
  additionalClass: '',
}

export default SpecQuestions
