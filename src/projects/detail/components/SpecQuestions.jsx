import React from 'react'
import PropTypes from 'prop-types'
import seeAttachedWrapperField from './SeeAttachedWrapperField'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
import _ from 'lodash'
import AddonOptions from './AddonOptions/AddonOptions'
import cn from 'classnames'

import SpecQuestionList from './SpecQuestionList/SpecQuestionList'
import SpecQuestionIcons from './SpecQuestionList/SpecQuestionIcons'
import SkillsQuestion from './SkillsQuestion/SkillsQuestion'
import SpecFeatureQuestion from './SpecFeatureQuestion'
import ColorSelector from './../../../components/ColorSelector/ColorSelector'
import SelectDropdown from './../../../components/SelectDropdown/SelectDropdown'
import ProjectEstimation from '../../create/components/ProjectEstimation'
import StaticSection from '../../create/components/StaticSection'

import {
  getVisibilityForRendering,
  geStepState,
  STEP_VISIBILITY,
  STEP_STATE,
} from '../../../helpers/wizardHelper'
import Accordion from './Accordion/Accordion'

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

const filterAddonQuestions = (productTemplates, question) => (
  _.filter(productTemplates, { category: question.category })
)

const formatAddonOptions = productTemplates => productTemplates.map(productTemplate => ({
  label: productTemplate.name,
  value: { id: productTemplate.id, productKey: productTemplate.productKey },
  description: productTemplate.details,
  subCategory: productTemplate.subCategory,
}))

const groupAddonOptions = (options, categories) => {
  const grouped = _.groupBy(options, 'subCategory')

  return Object.keys(grouped).map(subCategory => ({
    key: subCategory,
    title: (categories[subCategory] || {}).displayName,
    options: grouped[subCategory],
  }))
}

const buildAddonsOptions = (q, productTemplates, productCategories) => {
  const addOns = _.filter(productTemplates, (productTemplate) => productTemplate.isAddOn)
  return groupAddonOptions(
    formatAddonOptions(filterAddonQuestions(addOns, q)),
    _.keyBy(productCategories, 'key')
  )
}

// { isRequired, represents the overall questions section's compulsion, is also available}
class SpecQuestions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      skillOptions: []
    }
    this.handleSkillsLoaded = this.handleSkillsLoaded.bind(this)
    this.renderQ = this.renderQ.bind(this)
  }

  handleSkillsLoaded(skills) {
    this.setState({ skillOptions: skills })
  }


  renderQ(q, index) {
    const {
      project,
      template,
      currentWizardStep,
      dirtyProject,
      resetFeatures,
      showFeaturesDialog,
      isProjectDirty,
      productTemplates,
      productCategories,
    } = this.props
    const currentProjectData = isProjectDirty ? dirtyProject : project

    const elemProps = {
      name: q.fieldName,
      label: q.label,
      value: _.get(project, q.fieldName, ''),
      required: q.required,
      validations: q.required ? 'isRequired' : null,
      validationError: q.validationError,
      validationErrors: q.validationErrors,
    }
    if (q.options) {
      // don't show options which are hidden by conditions
      q.options = q.options.filter((option) => !_.get(option, '__wizard.hiddenByCondition'))
      // disable options if they are disabled by conditions
      q.options.forEach((option) => {
        option.disabled = _.get(option, '__wizard.disabledByCondition', false)
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
    case 'textinput': {
      const spacing = q.spacing || ''
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'row ' + spacing
      if (spacing.includes('spacing-gray-input')) {
        elemProps.placeholder = q.title
      }
      additionalItemClass += ` ${spacing}`
      // child = <TCFormFields.TextInput name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    }
    case 'numberinput': {
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'row'
      elemProps.type = 'number'
      if (!isNaN(q.minValue)) {
        elemProps.minValue = q.minValue
      }
      if (!isNaN(q.maxValue)) {
        elemProps.maxValue = q.maxValue
      }
      // update with default value only if we don't have any value yet
      if (!elemProps.value && !isNaN(q.defaultValue)) {
        elemProps.value = q.defaultValue
      }
      break
    }
    case 'numberinputpositive':
      ChildElem = TCFormFields.TextInput
      elemProps.wrapperClass = 'row'
      elemProps.type = 'number'
      elemProps.minValue = 0
      if (!isNaN(q.maxValue)) {
        elemProps.maxValue = q.maxValue
      }
      // update with default value only if we don't have any value yet
      if (!elemProps.value && !isNaN(q.defaultValue)) {
        elemProps.value = q.defaultValue
      }
      break
    case 'textbox':
      ChildElem = TCFormFields.Textarea
      elemProps.wrapperClass = 'row'
      elemProps.rows = 3
      elemProps.autoResize = true
      if (q.validations) {
        elemProps.validations = q.validations
      }
      // child = <TCFormFields.Textarea name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'radio-group':
      ChildElem = TCFormFields.RadioGroup
      _.assign(elemProps, { layout: q.layout, wrapperClass: cn('row', q.theme), options: q.options})
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
      _.assign(elemProps, {options: q.options, layout: q.layout, wrapperClass: q.theme })
      // child = <TCFormFields.CheckboxGroup name={q.fieldName} label={q.label} value={value} options={q.options} />
      break
    case 'checkbox':
      ChildElem = TCFormFields.Checkbox
      // child = <TCFormFields.Checkbox name={q.fieldName} label={q.label} value={value} />
      break
    case 'tiled-checkbox-group':
      ChildElem = TCFormFields.TiledCheckboxGroup
      _.assign(elemProps, { wrapperClass: 'row', options: q.options, theme: 'dark', tabable: true })
      // child = <TCFormFields.TiledRadioGroup name={q.fieldName} label={q.label} value={value} wrapperClass="row" options={q.options} />
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

      _.assign(elemProps, {
        title: q.title,
        hideTitle: true,
        hideDescription: true,
        description: q.description,
        allowMultiple: q.allowMultiple,
        options: buildAddonsOptions(q, productTemplates, productCategories),
        wrapperClass: q.theme
      })
      break
    case 'estimation':
      ChildElem = ProjectEstimation
      _.assign(elemProps, {
        question: q,
        project: currentProjectData,
        template,
        showDescription: true,
        theme: '',
        currentWizardStep,
        hideTitle: true
      })
      break
    case 'static':
      ChildElem = StaticSection
      _.assign(elemProps, {
        currentProjectData,
        content: q.content,
        hideTitle: true
      })
      break
    case 'skills':
      ChildElem = SkillsQuestion
      _.assign(elemProps, {
        currentProjectData,
        categoriesField: q.skills.categoriesField,
        categoriesMapping: q.skills.categoriesMapping,
        frequentSkills: q.skills.frequent,
        fieldName: q.fieldName,
        onSkillsLoaded: this.handleSkillsLoaded
      })
      break
    default:
      ChildElem = () => (
        <div style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: '#f00' }}>
          <h5 style={{ color: '#f00' }}>Unsupported question type `{q.type}`</h5>
          <pre style={{ fontFamily: 'monospace' }}>{JSON.stringify(_.omit(q, '__wizard'), null, 2)}</pre>
        </div>
      )
    }

    return (
      <SpecQuestionList.Item
        additionalClass = {cn(
          additionalItemClass,
          `question-type-${q.type}`, {
            [`question-theme-${q.theme}`]: !!q.theme,
            [`question-state-${q.stepState}`]: !!q.stepState,
            [`question-visibility-${q.visibilityForRendering}`]: !!q.visibilityForRendering
          }
        )}
        key={q.fieldName || `question-${index}`}
        title={q.title}
        type={q.type}
        // titleAside={titleAside}
        icon={getIcon(q.icon)}
        description={q.description}
        required={q.required || (q.validations && q.validations.indexOf('isRequired') !== -1)}
        hideDescription={elemProps.hideDescription}
        hideTitle={elemProps.hideTitle}
        help={q.help}
        introduction={q.introduction}
      >
        <ChildElem {...elemProps} />
      </SpecQuestionList.Item>
    )
  }

  render() {
    const {
      questions,
      layout,
      additionalClass,
      template,
      currentWizardStep,
      showHidden,
      productTemplates,
      productCategories,
      isCreation,
    } = this.props
    const { skillOptions } = this.state

    return (
      <SpecQuestionList layout={layout} additionalClass={additionalClass}>
        {questions.map(question => ({
          ...question,
          visibilityForRendering: isCreation ? getVisibilityForRendering(template, question, currentWizardStep) : STEP_VISIBILITY.READ_OPTIMIZED,
          stepState: isCreation ? geStepState(question, currentWizardStep) : STEP_STATE.PREV
        })).filter((question) =>
          // hide if we are in a wizard mode and question is hidden for now
          (question.visibilityForRendering !== STEP_VISIBILITY.NONE) &&
          // hide if question is hidden by condition
          (!_.get(question, '__wizard.hiddenByCondition')) &&
          // hide hidden questions, unless we not force to show them
          (showHidden || !question.hidden) &&
          // hide question in edit mode if configured
          (isCreation || !question.hiddenOnEdit)
        ).map((q, index) => {
          return  (
            _.includes(['checkbox-group', 'radio-group', 'add-ons', 'textinput', 'textbox', 'numberinput', 'skills', 'slide-radiogroup', 'select-dropdown'], q.type) && q.visibilityForRendering === STEP_VISIBILITY.READ_OPTIMIZED ? (
              <Accordion
                key={q.fieldName || `accordion-${index}`}
                title={q.summaryTitle || q.title}
                type={q.type}
                options={q.options || skillOptions || buildAddonsOptions(q, productTemplates, productCategories)}
              >
                {this.renderQ(q, index)}
              </Accordion>
            ) : (
              this.renderQ(q, index)
            )
          )
        })}
      </SpecQuestionList>
    )
  }
}

SpecQuestions.propTypes = {
  /**
   * Original project object for which questions are to be rendered
   */
  project: PropTypes.object.isRequired,

  /**
   * Original Project template
   */
  template: PropTypes.object.isRequired,

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

  /**
   * list of product categories
   */
  productCategories: PropTypes.array.isRequired,

  /**
   * Determines if we are now during project creation or project edit
   */
  isCreation: PropTypes.bool,
}

SpecQuestions.defaultProps = {
  additionalClass: '',
}

export default SpecQuestions
