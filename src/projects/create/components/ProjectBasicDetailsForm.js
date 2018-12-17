import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import update from 'react-addons-update'
import { evaluate, getFieldNamesFromExpression } from '../../../helpers/dependentQuestionsHelper'
import { flatten, unflatten } from 'flat'
import { LS_INCOMPLETE_WIZARD } from '../../../config/constants'
import Modal from 'react-modal'
import './ProjectBasicDetailsForm.scss'

import SpecSection from '../../detail/components/SpecSection'

const PREVIOUS_STEP_VISIBILITY = {
  NONE: 'none',
  READ_ONLY: 'readOnly',
  WRITE: 'write',
}

const LEVEL = {
  SECTION: 'section',
  SUB_SECTION: 'subSection',
  QUESTION: 'question'
}

const STEP_DIR = {
  NEXT: +1,
  PREV: -1,
  SAME: 0,
}

const shouldStepBeHidden = (previousStepVisibility, currentStep, lastWizardStep) => {
  if (!lastWizardStep) {
    const level = getStepLevel(currentStep)
    return currentStep[`${level}Index`] !== 0
  } else if (previousStepVisibility === PREVIOUS_STEP_VISIBILITY.NONE) {
    return !isSameStepAnyLevel(currentStep, lastWizardStep)
  } else if (previousStepVisibility === PREVIOUS_STEP_VISIBILITY.READ_ONLY) {
    return getDirForSteps(currentStep, lastWizardStep) === STEP_DIR.PREV
  } else {
    return true
  }
}

const isSameStepAnyLevel = (parentStep, step) => {
  let isParent = parentStep.sectionIndex !== -1 && parentStep.sectionIndex === step.sectionIndex

  if (parentStep.subSectionIndex !== -1) {
    isParent = isParent && parentStep.subSectionIndex === step.subSectionIndex
  }

  if (parentStep.questionIndex !== -1) {
    isParent = isParent && parentStep.questionIndex === step.questionIndex
  }

  return isParent
}

/**
 * Add auxillary `__wizard` property for sections, subSections and questions
 * if they have `wizard` property set to `true`.
 *
 * @param {Object} template         raw template
 * @param {Object} project          project data (non-flat)
 * @param {Object} incompleteWizard incomplete wizard props
 *
 * @returns {Object} template with initialized `__wizard` property
 */
const initWizard = (template, project, incompleteWizard) => {
  const flatProjectData = flatten(project, { safe: true })
  let wizardTemplate = _.cloneDeep(template)
  // try to get the step where we left the wizard
  const lastWizardStep = incompleteWizard && incompleteWizard.currentWizardStep
  // current step will define the first of the wizard in case we have to start the wizard from the beginning
  let currentWizardStep = {
    sectionIndex: -1,
    subSectionIndex: -1,
    questionIndex: -1,
  }
  let prevWizardStep = null

  // default props values
  const defaultWizardProps = {
    previousStepVisibility: PREVIOUS_STEP_VISIBILITY.WRITE
  }

  // list of properties which values would be inherited from the parent
  const inheritedWizardProps = ['previousStepVisibility']

  const normalizeWizardProps = (level) => {
    // first create object of props which would be inherited by children
    normalizeWizardProps.currentLevelInheritedProps = {
      ...normalizeWizardProps.currentLevelInheritedProps,
      ..._.pick(level.wizard, inheritedWizardProps)
    }

    // update wizard props of the current level
    level.wizard = {
      ...normalizeWizardProps.currentLevelInheritedProps,
      ...level.wizard
    }
  }
  normalizeWizardProps.currentLevelInheritedProps = {...defaultWizardProps}

  // only if template has `wizard: false` we will initialize wizards and conditional questions
  // by our logic only if all parents have wizard enabled, a child can have wizard enabled
  if (_.get(wizardTemplate, 'wizard.enabled') || wizardTemplate.wizard === true) {
    // initialize wizard for the whole template
    wizardTemplate.__wizard = {
      // there will be the list of all fields which have dependencies in the template
      dependantFields: []
    }

    normalizeWizardProps(wizardTemplate)
    currentWizardStep.sectionIndex = 0
    const previousStepVisibility = wizardTemplate.wizard.previousStepVisibility

    // initialize sections wizard
    wizardTemplate.sections.forEach((section, sectionIndex) => {
      normalizeWizardProps(section)
      const step = {
        sectionIndex,
        subSectionIndex: -1,
        questionIndex: -1
      }
      section.__wizard = {
        isStep: true,
        hidden: shouldStepBeHidden(previousStepVisibility, step, lastWizardStep),
        step,
      }

      // init __wizard and conditional questions for all subSections
      section.subSections.forEach((subSection, subSectionIndex) => {
        const step = {
          sectionIndex,
          subSectionIndex,
          questionIndex: -1
        }
        if (!subSection.__wizard) {
          subSection.__wizard = {
            step,
          }
        }

        // init __wizard and conditional questions for all questions
        subSection.questions && subSection.questions.forEach((question, questionIndex) => {
          const step = {
            sectionIndex,
            subSectionIndex,
            questionIndex
          }
          if (!question.__wizard) {
            question.__wizard = {
              step,
            }
          }

          if (question.condition) {
            question.__wizard.hiddenByCondition = !evaluate(question.condition, flatProjectData)
            wizardTemplate.__wizard.dependantFields = _.uniq([
              ...wizardTemplate.__wizard.dependantFields,
              ...getFieldNamesFromExpression(question.condition)
            ])
          }
        })
      })

      // initialize subSections wizard
      if (_.get(section, 'wizard.enabled') || section.wizard === true) {
        // only if we are still in the first section we can treat first subSection as current
        if (sectionIndex === 0) {
          currentWizardStep.subSectionIndex = 0
        }

        section.subSections.forEach((subSection) => {
          normalizeWizardProps(subSection)
          subSection.__wizard.isStep = true
          subSection.__wizard.hidden = shouldStepBeHidden(previousStepVisibility, subSection.__wizard.step, lastWizardStep)

          // initialize questions wizard
          if ((_.get(subSection, 'wizard.enabled') || subSection.wizard === true) && subSection.questions) {
            // only if we are still in the first section and first subSections we can treat first question as current
            if (sectionIndex === 0 && subSection === 0) {
              currentWizardStep.questionIndex = 0
            }

            subSection.questions.forEach((question) => {
              question.__wizard.isStep = true
              question.__wizard.hidden = shouldStepBeHidden(previousStepVisibility, question.__wizard.step, lastWizardStep)
            })
          }
        })
      }
    })

    // finalizing all the steps before lastWizardStep in readOnly mode
    if (lastWizardStep && previousStepVisibility === PREVIOUS_STEP_VISIBILITY.READ_ONLY) {
      let tempStep = currentWizardStep

      while (tempStep && getDirForSteps(tempStep, lastWizardStep) === STEP_DIR.NEXT) {
        wizardTemplate = finalizeStep(wizardTemplate, tempStep)
        tempStep = getNextStepToShow(wizardTemplate, tempStep)
      }
    }

    if (lastWizardStep) {
      prevWizardStep = getPrevStepToShow(wizardTemplate, lastWizardStep)
    }
  }

  console.warn('wizardTemplate', wizardTemplate)

  currentWizardStep = lastWizardStep || currentWizardStep

  return {
    template: wizardTemplate,
    currentWizardStep,
    prevWizardStep,
  }
}

const sign = (x) => ((x > 0) - (x < 0)) || +x

const getDirForSteps = (step1, step2) => {
  const questionSign = sign(step2.questionIndex - step1.questionIndex)
  const subSectionSign = sign(step2.subSectionIndex - step1.subSectionIndex)
  const sectionSign = sign(step2.sectionIndex - step1.sectionIndex)

  const dir = sectionSign || subSectionSign || questionSign

  return dir
}

const getStepByDir = (template, currentStep, dir) => {
  // get the sibling of the current step if possible
  let dirStep = getSiblingStepByDir(template, currentStep, dir)

  // if there is no sibling
  // checking siblings of parent levels
  let tempStep = currentStep
  while (!dirStep && (tempStep = getParentStep(tempStep))) {
    const parentStepObject = getStepObject(template, tempStep)

    if (_.get(parentStepObject, '__wizard.isStep')) {
      dirStep = getSiblingStepByDir(template, tempStep, dir)
    }
  }

  // no matter where we got step: between the sibling of the current step
  // or between siblings of the parent levels
  // try to find the most inner step inside the possible step
  if (dirStep) {
    let tempStep = dirStep

    while (_.get(getStepObject(template, tempStep), 'wizard.enabled')) {
      const childrenSteps = getStepChildren(template, tempStep)

      const childStepIndex = dir === STEP_DIR.NEXT ? 0 : childrenSteps.length - 1

      if (childrenSteps[childStepIndex]) {
        tempStep = childrenSteps[childStepIndex]
      }
    }

    return tempStep
  }

  return null
}

const getStepToShowByDir = (template, currentStep, dir) => {
  let tempStep = currentStep
  let tempStepObject

  do {
    tempStep = getStepByDir(template, tempStep, dir)
    tempStepObject = tempStep && getStepObject(template, tempStep)
  } while (tempStepObject && _.get(tempStepObject, '__wizard.hiddenByCondition'))

  return tempStep
}

const getNextStepToShow = (template, currentStep) => (
  getStepToShowByDir(template, currentStep, STEP_DIR.NEXT)
)

const getPrevStepToShow = (template, currentStep) => (
  getStepToShowByDir(template, currentStep, STEP_DIR.PREV)
)

const getSiblingStepByDir = (template, step, dir) => {
  const level = getStepLevel(step)
  let siblingStep = null

  switch(level) {
  case LEVEL.QUESTION:
    siblingStep = {
      ...step,
      questionIndex: step.questionIndex + dir
    }
    break
  case LEVEL.SUB_SECTION:
    siblingStep = {
      ...step,
      subSectionIndex: step.subSectionIndex + dir
    }
    break
  case LEVEL.SECTION:
    siblingStep = {
      ...step,
      sectionIndex: step.sectionIndex + dir
    }
    break
  default: siblingStep = null
  }

  if (siblingStep && getStepObject(template, siblingStep, level)) {
    return siblingStep
  } else {
    return null
  }
}

const getNextSiblingStep = (template, step) => (
  getSiblingStepByDir(template, step, STEP_DIR.NEXT)
)

const getPrevSiblingStep = (template, step) => (
  getSiblingStepByDir(template, step, STEP_DIR.PREV)
)

/**
 * Update question in template without template mutation
 *
 * @param {Object} template        template
 * @param {Number} sectionIndex    section index
 * @param {Number} subSectionIndex subSection index
 * @param {Number} questionIndex   question index
 * @param {Object} updateRule      rule acceptable by update function
 *
 * @returns {Object} updated template
 */
const updateQuestion = (template, sectionIndex, subSectionIndex, questionIndex, updateRule) => {
  const section = template.sections[sectionIndex]
  const subSection = section.subSections[subSectionIndex]
  const question = subSection.questions[questionIndex]

  const updatedQuestion = update(question, updateRule)

  return updateSubSection(template, sectionIndex, subSectionIndex, {
    questions: {
      $splice: [[questionIndex, 1, updatedQuestion]]
    }
  })
}

/**
 * Update sebSection in template without template mutation
 *
 * @param {Object} template        template
 * @param {Number} sectionIndex    section index
 * @param {Number} subSectionIndex subSection index
 * @param {Object} updateRule      rule acceptable by update function
 *
 * @returns {Object} updated template
 */
const updateSubSection = (template, sectionIndex, subSectionIndex, updateRule) => {
  const section = template.sections[sectionIndex]
  const subSection = section.subSections[subSectionIndex]

  const updatedSubSection = update(subSection, updateRule)

  return updateSection(template, sectionIndex, {
    subSections: {
      $splice: [[subSectionIndex, 1, updatedSubSection]]
    }
  })
}

/**
 * Update section in template without template mutation
 *
 * @param {Object} template        template
 * @param {Number} sectionIndex    section index
 * @param {Object} updateRule      rule acceptable by update function
 *
 * @returns {Object} updated template
 */
const updateSection = (template, sectionIndex, updateRule) => {
  const section = template.sections[sectionIndex]

  const updatedSection = update(section, updateRule)

  const updatedTemplate = update(template, {
    sections: {
      $splice: [[sectionIndex, 1, updatedSection]]
    }
  })

  return updatedTemplate
}

const updateStepObject = (template, step, updateRule, level) => {
  const { sectionIndex, subSectionIndex, questionIndex } = step
  let updatedTemplate = template

  switch (level) {
  case LEVEL.QUESTION:
    updatedTemplate = updateQuestion(template, sectionIndex, subSectionIndex, questionIndex, updateRule)
    break
  case LEVEL.SUB_SECTION:
    updatedTemplate = updateSubSection(template, sectionIndex, subSectionIndex, updateRule)
    break
  case LEVEL.SECTION:
    updatedTemplate = updateSection(template, sectionIndex, updateRule)
    break
  default:
    if (questionIndex !== -1) {
      updatedTemplate = updateQuestion(template, sectionIndex, subSectionIndex, questionIndex, updateRule)
    } else if (subSectionIndex !== -1) {
      updatedTemplate = updateSubSection(template, sectionIndex, subSectionIndex, updateRule)
    } else if (sectionIndex !== -1) {
      updatedTemplate = updateSection(template, sectionIndex, updateRule)
    }
  }

  return updatedTemplate
}

const getStepObject = (template, step, level) => {
  const { section, subSection, question } = getStepAllLevelsObjects(template, step)

  switch (level) {
  case LEVEL.QUESTION: return question
  case LEVEL.SUB_SECTION: return subSection
  case LEVEL.SECTION: return section
  default:
    return question || subSection || section
  }
}

const getStepAllLevelsObjects = (template, step) => {
  const { sectionIndex, subSectionIndex, questionIndex } = step
  const section = sectionIndex !== -1 ? template.sections[sectionIndex] : null
  const subSection = section && subSectionIndex !== -1 ? section.subSections[subSectionIndex] : null
  const question = section && subSection && subSection.questions && questionIndex !== -1 ? subSection.questions[questionIndex] : null

  return {
    section,
    subSection,
    question,
  }
}

const isStepLevel = (step, level) => {
  if (!step) {
    return false
  }

  const { sectionIndex, subSectionIndex, questionIndex } = step

  switch (level) {
  case LEVEL.QUESTION: return questionIndex !== -1 && subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.SUB_SECTION: return subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.SECTION: return sectionIndex !== -1
  default: return false
  }
}

const isStepSection = (step) => (
  isStepLevel(step, LEVEL.SECTION)
)

const isStepSubSection = (step) => (
  isStepLevel(step, LEVEL.SUB_SECTION)
)

const isStepQuestion = (step) => (
  isStepLevel(step, LEVEL.QUESTION)
)

const getStepLevel = (step) => {
  if (isStepQuestion(step)) {
    return LEVEL.QUESTION
  }

  if (isStepSubSection(step)) {
    return LEVEL.SUB_SECTION
  }

  if (isStepSection(step)) {
    return LEVEL.SECTION
  }

  return null
}

const getParentStep = (step) => {
  if (step.questionIndex !== -1) {
    return {
      ...step,
      questionIndex: -1
    }
  } else if (step.subSectionIndex !== -1) {
    return {
      ...step,
      subSectionIndex: -1
    }
  } else if (step.sectionIndex !== -1) {
    return {
      ...step,
      sectionIndex: -1
    }
  } else {
    return null
  }
}

const getStepChildren = (template, step) => {
  const stepObject = getStepObject(template, step)

  return (stepObject.questions || stepObject.subSections || stepObject.sections || []).map((stepObject) => (
    _.get(stepObject, '__wizard.step')
  ))
}

/**
 * Update questions in template using question conditions and data
 *
 * @param {Object} template        template
 * @param {Object} project data to evaluate question conditions
 *
 * @returns {Object} updated template
 */
const updateQuestionsByConditions = (template, project, dirtyProject) => {
  let updatedTemplate = template
  let hasHiddenQuestion = false

  let flatProjectData = flatten(removeValuesOfHiddenQuestions(updatedTemplate, dirtyProject), { safe: true })
  let { questionToUpdate, hiddenByCondition } = getQuestionWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData)
  while (questionToUpdate) {
    updatedTemplate = updateStepObject(updatedTemplate, questionToUpdate, {
      __wizard: {
        hiddenByCondition: { $set: hiddenByCondition }
      }
    })

    flatProjectData = flatten(removeValuesOfHiddenQuestions(updatedTemplate, dirtyProject), { safe: true })
    const nextQuestionToUpdate = getQuestionWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData)
    questionToUpdate = nextQuestionToUpdate.questionToUpdate
    hiddenByCondition = nextQuestionToUpdate.hiddenByCondition

    hasHiddenQuestion = hasHiddenQuestion || hiddenByCondition
  }

  const updatedProject = hasHiddenQuestion ? dirtyProject : project

  return {
    updatedTemplate,
    updatedProject,
  }
}

const removeValuesOfHiddenQuestions = (template, project) => {
  let updatedProject = project

  _.forEach(template.sections, (section) => {
    _.forEach(section.subSections, (subSection) => {
      subSection.questions && _.forEach(subSection.questions, (question) => {
        if (question.__wizard.hiddenByCondition && _.get(project, question.fieldName)) {
          updatedProject = update(updatedProject, unflatten({
            [question.fieldName]: { $set: '' }
          }))
        }
      })
    })
  })

  return updatedProject
}

const getQuestionWhichMustBeUpdatedByCondition = (template, flatProjectData) => {
  let questionToUpdate = null
  let hiddenByCondition

  _.forEach(template.sections, (section, sectionIndex) => {
    _.forEach(section.subSections, (subSection, subSectionIndex) => {
      subSection.questions && _.forEach(subSection.questions, (question, questionIndex) => {
        if (question.condition) {
          hiddenByCondition = !evaluate(question.condition, flatProjectData)

          // only update if the condition result has changed
          if (hiddenByCondition !== question.__wizard.hiddenByCondition) {
            questionToUpdate = {
              sectionIndex, subSectionIndex, questionIndex
            }
          }
        }

        return !questionToUpdate
      })

      return !questionToUpdate
    })

    return !questionToUpdate
  })

  return {
    questionToUpdate,
    hiddenByCondition,
  }
}

const finalizeStep = (template, step, value = true) => {
  let updatedTemplate = template

  const stepObject = getStepObject(updatedTemplate, step)
  const parentStep = getParentStep(step)
  const stepParentObject = getStepObject(updatedTemplate, parentStep)

  const previousStepVisibility = _.get(stepParentObject, 'wizard.previousStepVisibility',
    _.get(updatedTemplate, 'wizard.previousStepVisibility')
  )

  const updateRules = {
    [PREVIOUS_STEP_VISIBILITY.READ_ONLY]: {
      __wizard: {
        readOnly: { $set: value }
      }
    },
    [PREVIOUS_STEP_VISIBILITY.NONE]: {
      __wizard: {
        hidden: { $set: value }
      }
    },
  }

  const updateRule = updateRules[previousStepVisibility]

  if (updateRule) {
    updatedTemplate = updateStepObject(updatedTemplate, step, updateRule)

    // if the children of current step are not in wizard mode and we are making step read-only
    // we also have make such children read-only
    if (previousStepVisibility === PREVIOUS_STEP_VISIBILITY.READ_ONLY && !_.get(stepObject, 'wizard.enabled')) {
      const stepChildren = getStepChildren(updatedTemplate, step)

      stepChildren.forEach((stepChild) => {
        updatedTemplate = updateStepObject(updatedTemplate, stepChild, updateRule)
      })
    }
  }

  return updatedTemplate
}

const showStepByDir = (template, currentStep, dir) => {
  let updatedTemplate = template
  let tempStep

  // if we are moving to the next step, we have to finalize previous one
  if (dir === STEP_DIR.NEXT) {
    // finalize step on it's level all parent levels of the step
    // as long as step is the last on the current level
    tempStep = currentStep
    do {
      updatedTemplate = finalizeStep(updatedTemplate, tempStep)

      // if step is the last on the current level, we also finalize parent level step
      if (!getNextSiblingStep(updatedTemplate, tempStep, dir)) {
        tempStep = getParentStep(tempStep)
      } else {
        tempStep = null
      }
    } while (tempStep)

  // if we are moving to the previous step, we just have to hide current step
  } else {
    tempStep = currentStep

    do {
      updatedTemplate = updateStepObject(updatedTemplate, tempStep, {
        __wizard: {
          hidden: { $set: true }
        }
      })

      // if step is the first on the current level, we also hide parent level step
      if (!getPrevSiblingStep(updatedTemplate, tempStep, dir)) {
        tempStep = getParentStep(tempStep)
      } else {
        tempStep = null
      }
    } while (tempStep)
  }

  const nextStep = getStepToShowByDir(updatedTemplate, currentStep, dir)

  if (!nextStep) {
    console.warn('showNextStep method is called when there is no next step, probably something is wrong.')
  }

  // make visible current step and all it's parents
  tempStep = nextStep
  do {
    updatedTemplate = updateStepObject(updatedTemplate, tempStep, {
      __wizard: {
        hidden: { $set: false }
      }
    })
    tempStep = getParentStep(tempStep)
  } while (tempStep)

  if (dir === STEP_DIR.PREV && _.get(updatedTemplate, 'wizard.previousStepVisibility') === PREVIOUS_STEP_VISIBILITY.READ_ONLY) {
    updatedTemplate = finalizeStep(updatedTemplate, nextStep, false)
  }

  return {
    updatedTemplate,
    nextStep,
  }
}

const rewindToStep = (template, currentStep, destinationStep) => {
  const dir = getDirForSteps(currentStep, destinationStep)
  let tempStep = currentStep
  let tempDir = dir
  let updatedTemplate = template

  if (dir === STEP_DIR.SAME) {
    return updatedTemplate
  }

  while (tempDir === dir) {
    const nextStepData = showStepByDir(updatedTemplate, tempStep, dir)

    updatedTemplate = nextStepData.updatedTemplate
    tempStep = nextStepData.nextStep
    tempDir = getDirForSteps(tempStep, destinationStep)
  }

  return updatedTemplate
}

class ProjectBasicDetailsForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.showNextStep = this.showNextStep.bind(this)
    this.showPrevStep = this.showPrevStep.bind(this)
    this.startEditReadOnly = this.startEditReadOnly.bind(this)
    this.stopEditReadOnly = this.stopEditReadOnly.bind(this)
    this.cancelEditReadOnly = this.cancelEditReadOnly.bind(this)
    this.confirmEditReadOnly = this.confirmEditReadOnly.bind(this)

    const incompleteWizardStr = window.localStorage.getItem(LS_INCOMPLETE_WIZARD)
    let incompleteWizard = {}
    if (incompleteWizardStr) {
      try {
        incompleteWizard = JSON.parse(incompleteWizardStr)
      } catch (e) {
        console.error('Cannot parse incomplete Wizard state.')
      }
    }
    const { template, currentWizardStep, prevWizardStep } = initWizard(props.template, props.project, incompleteWizard)

    this.state = {
      template,
      nextWizardStep: getNextStepToShow(template, currentWizardStep),
      showStartEditConfirmation: null,
      prevWizardStep,
    }

    // we don't use for rendering, only for internal needs, so we don't need it in state
    this.currentWizardStep = currentWizardStep
  }

  startEditReadOnly(step) {
    const { template } = this.state
    const stepObject = getStepObject(template, step)

    if (_.includes(_.get(template, '__wizard.dependantFields', []), stepObject.fieldName)) {
      this.setState({
        showStartEditConfirmation: step,
      })
    } else {
      this._startEditReadOnly(step)
    }
  }

  cancelEditReadOnly() {
    this.setState({
      showStartEditConfirmation: null,
    })
  }

  confirmEditReadOnly() {
    this._startEditReadOnly(this.state.showStartEditConfirmation)
    this.setState({
      showStartEditConfirmation: null,
    })
  }

  _startEditReadOnly(step) {
    const { template } = this.state
    let updatedTemplate = template

    // find a real step
    let tempStep = step
    let tempStepObject = getStepObject(updatedTemplate, tempStep)
    while (tempStep && !_.get(tempStepObject, '__wizard.isStep')) {
      tempStep = getParentStep(tempStep)
      tempStepObject = getStepObject(updatedTemplate, tempStep)
    }
    step = tempStep

    updatedTemplate = rewindToStep(updatedTemplate, this.currentWizardStep, step)
    this.currentWizardStep = step

    this.setState({
      template: updatedTemplate,
    })

    window.localStorage.setItem(LS_INCOMPLETE_WIZARD, JSON.stringify({
      currentWizardStep: this.currentWizardStep
    }))
  }

  stopEditReadOnly(step) {
    const { template } = this.state

    const updatedTemplate = updateStepObject(template, step, {
      __wizard: {
        readOnly: {
          $set: true
        },
        editReadOnly: {
          $set: false
        }
      }
    })

    this.setState({
      template: updatedTemplate,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextProps.dirty, this.props.dirty)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextState.canSubmit, this.state.canSubmit)
     && _.isEqual(nextState.template, this.state.template)
     && _.isEqual(nextState.isSaving, this.state.isSaving)
     && _.isEqual(nextState.nextWizardStep, this.state.nextWizardStep)
     && _.isEqual(nextState.prevWizardStep, this.state.prevWizardStep)
     && _.isEqual(nextState.showStartEditConfirmation, this.state.showStartEditConfirmation)
    )
  }

  componentWillMount() {
    this.setState({
      project: Object.assign({}, this.props.project),
      canSubmit: false
    })
  }

  componentWillReceiveProps(nextProps) {
    // we receipt property updates from PROJECT_DIRTY REDUX state
    /* if (nextProps.project.isDirty) return
    const updatedProject = Object.assign({}, nextProps.project)
    this.setState({
      project: updatedProject,
      isSaving: false,
      canSubmit: false
    }) */
    if (!_.isEqual(nextProps.dirtyProject, this.props.dirtyProject)) {
      const { updatedTemplate, updatedProject } = updateQuestionsByConditions(this.state.template, this.state.project, nextProps.dirtyProject)

      this.setState({
        template: updatedTemplate,
        project: updatedProject,
      })
    }
    if (!_.isEqual(this.props.template, nextProps.template)) {
      this.setState({
        template: initWizard(nextProps.template)
      })
    }
  }

  isChanged() {
    // We check if this.refs.form exists because this may be called before the
    // first render, in which case it will be undefined.
    return (this.refs.form && this.refs.form.isChanged())
  }

  enableButton() {
    this.setState( { canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  submit(model) {
    console.log('submit', this.isChanged())
    this.setState({isSaving: true })
    this.props.submitHandler(model)
  }

  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   * @param isChanged flag that indicates if form actually changed from initial model values
   */
  handleChange(change) {
    // removed check for isChanged argument to fire the PROJECT_DIRTY event for every change in the form
    // this.props.fireProjectDirty(change)

    this.props.onProjectChange(change)
  }

  showStepByDir(evt, dir) {
    // prevent default to avoid form being submitted
    evt.preventDefault()

    const { template } = this.state
    const { updatedTemplate, nextStep } = showStepByDir(template, this.currentWizardStep, dir)

    this.setState({
      template: updatedTemplate,
      nextWizardStep: getNextStepToShow(updatedTemplate, nextStep),
      prevWizardStep: dir === STEP_DIR.NEXT ? this.currentWizardStep : getPrevStepToShow(updatedTemplate, nextStep),
      project: this.props.dirtyProject,
    })

    this.currentWizardStep = nextStep

    window.localStorage.setItem(LS_INCOMPLETE_WIZARD, JSON.stringify({
      currentWizardStep: this.currentWizardStep
    }))
  }

  showNextStep(evt) {
    this.showStepByDir(evt, STEP_DIR.NEXT)
  }

  showPrevStep(evt) {
    this.showStepByDir(evt, STEP_DIR.PREV)
  }

  render() {
    const { isEditable, submitBtnText } = this.props
    const {
      project,
      canSubmit,
      template,
      nextWizardStep,
      prevWizardStep,
      showStartEditConfirmation,
    } = this.state

    // const isPreviousStepVisibilityNone = _.get(template, 'wizard.previousStepVisibility') === PREVIOUS_STEP_VISIBILITY.NONE

    const renderSection = (section, idx) => {
      return (
        <div key={idx} className="ProjectBasicDetailsForm">
          <div className="sections">
            <SpecSection
              {...section}
              project={project}
              sectionNumber={idx + 1}
              showFeaturesDialog={ () => {} }//dummy
              resetFeatures={ () => {} }//dummy
              // TODO we should not update the props (section is coming from props)
              // further, it is not used for this component as we are not rendering spec screen section here
              validate={() => {}}//dummy
              isCreation
              startEditReadOnly={this.startEditReadOnly}
              stopEditReadOnly={this.stopEditReadOnly}
            />
          </div>
        </div>
      )
    }

    return (
      <div>
        <Modal
          isOpen={!!showStartEditConfirmation}
          className="delete-post-dialog"
          overlayClassName="delete-post-dialog-overlay"
          onRequestClose={this.cancelEditReadOnly}
          contentLabel=""
        >
          <div className="modal-title">
            Confirmation
          </div>

          <div className="modal-body">
            You are about to change the response to question which may result in loss of data, do you want to continue?
          </div>

          <div className="button-area flex center action-area">
            <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={this.cancelEditReadOnly}>Cancel</button>
            <button className="tc-btn tc-btn-warning tc-btn-sm action-btn " onClick={this.confirmEditReadOnly}>Continue</button>
          </div>
        </Modal>

        <Formsy.Form
          ref="form"
          disabled={!isEditable}
          onInvalid={this.disableButton}
          onValid={this.enableButton}
          onValidSubmit={this.submit}
          onChange={ this.handleChange }
        >
          {template.sections.filter(section => (
            // hide if we are in a wizard mode and section is hidden for now
            !_.get(section, '__wizard.hidden')
          )).map(renderSection)}
          <div className="section-footer section-footer-spec">
            <button
              className="tc-btn tc-btn-default tc-btn-md"
              type="button"
              onClick={this.showPrevStep}
              disabled={!prevWizardStep}
            >Back</button>
            {nextWizardStep ? (
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                type="button"
                disabled={!canSubmit}
                onClick={this.showNextStep}
              >Next</button>
            ) : (
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                type="submit"
                disabled={(this.state.isSaving) || !canSubmit}
              >{ submitBtnText }</button>
            )}
          </div>
        </Formsy.Form>
      </div>
    )
  }
}

ProjectBasicDetailsForm.propTypes = {
  project: PropTypes.object.isRequired,
  saving: PropTypes.bool.isRequired,
  template: PropTypes.object.isRequired,
  isEditable: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired
}

export default ProjectBasicDetailsForm
