/**
 * Helper methods for project creation/edition wizard mode and conditional questions.
 *
 * The main idea behind wizard helper is that it's a set of methods which contain all the wizard logic,
 * and these methods can update projectTemplate.scope which is used to render the form.
 * The form rendering component doesn't contain any wizard logic, it just renders projectTemplate.scope which
 * was processed by the methods in this helper.
 *
 * Glossary:
 *   - `step`: we call any section, subSection, question or option
 *             step is defined as an object with indexes:
 *             {
 *                sectionIndex: Number,
 *                subSectionIndex: Number,
 *                questionIndex: Number,
 *                optionIndex: Number,
 *             }
 *             If some index is not applicable it has be defined as -1.
 *   - `stepObject`: it's an actual section, subSection, question or option object
 *   - `read step`: is a step which has to be shown as one single step in wizard
 */
import _ from 'lodash'
import update from 'react-addons-update'
import { evaluate, getFieldNamesFromExpression } from './dependentQuestionsHelper'
import { flatten, unflatten } from 'flat'

/**
 * Defines how to display form steps which has been already filled
 */
export const PREVIOUS_STEP_VISIBILITY = {
  NONE: 'none',
  READ_ONLY: 'readOnly',
  WRITE: 'write',
}

/**
 * Form template has many levels, and this constant define them
 */
export const LEVEL = {
  SECTION: 'section',
  SUB_SECTION: 'subSection',
  QUESTION: 'question',
  OPTION: 'option'
}

/**
 * Define relation between steps
 * - the step is next to another one
 * - the step previous to another one
 * - it's a same step
 */
export const STEP_DIR = {
  NEXT: +1,
  PREV: -1,
  SAME: 0,
}

/**
 * Determines if step has to be hidden during wizard initialization
 *
 * @param {String} previousStepVisibility previous step visibility in wizard
 * @param {Object} currentStep            the step which we iterate
 * @param {Object} lastWizardStep         the last step which was previously filled
 *
 * @returns {Boolean} true if step has to be hidden
 */
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

/**
 * Determine if `step` is any level ancestor of `parentStep`
 *
 * @param {Object} parentStep parent step
 * @param {Object} step       step to check
 *
 * @returns {Boolean} true if `step` is any ancestor of `parentStep`
 */
const isSameStepAnyLevel = (parentStep, step) => {
  let isParent = parentStep.sectionIndex !== -1 && parentStep.sectionIndex === step.sectionIndex

  if (parentStep.subSectionIndex !== -1) {
    isParent = isParent && parentStep.subSectionIndex === step.subSectionIndex
  }

  if (parentStep.questionIndex !== -1) {
    isParent = isParent && parentStep.questionIndex === step.questionIndex
  }

  if (parentStep.optionIndex !== -1) {
    isParent = isParent && parentStep.optionIndex === step.optionIndex
  }

  return isParent
}

/**
 * Check if wizard mode is enabled in template
 *
 * @param {Object} template template
 *
 * @returns {Boolean} true if wizard mode is enabled
 */
export const isWizardModeEnabled = (template) => (
  _.get(template, 'wizard.enabled') || template.wizard === true
)

/**
 * Get wizard previous step visibility
 *
 * @param {Object} template template
 *
 * @returns {String} previous step visibility
 */
export const getPreviousStepVisibility = (template) => (
  _.get(template, 'wizard.previousStepVisibility', PREVIOUS_STEP_VISIBILITY.WRITE)
)

/**
 * Iterates through all the steps of the template: sections, subSections, questions, options.
 *
 * If iteratee returns `false` iteration will be stopped.
 *
 * @param {Object}   template template
 * @param {Function} iteratee function which is called for each step with signature (stepObject, step)
 * @param {Function} [iterateSublevelCondition] if returns false, we don't iterate through the steps of the child level
 */
export const forEachStep = (template, iteratee, iterateSublevelCondition) => {
  let iterateeResult

  // iterate SECTIONS
  _.forEach(template.sections, (section, sectionIndex) => {
    const sectionStep = {
      sectionIndex,
      subSectionIndex: -1,
      questionIndex: -1,
      optionIndex: -1,
    }
    iterateeResult = iteratee(section, sectionStep)

    // iterate SUB_SECTIONS
    if (iterateeResult !== false
      && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(section, sectionStep))
    ) {
      _.forEach(section.subSections, (subSection, subSectionIndex) => {
        const subSectionStep = {
          sectionIndex,
          subSectionIndex,
          questionIndex: -1,
          optionIndex: -1,
        }
        iterateeResult = iteratee(subSection, subSectionStep)

        // iterate QUESTIONS
        if (iterateeResult !== false
          && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(subSection, subSectionStep))
        ) {
          subSection.questions && _.forEach(subSection.questions, (question, questionIndex) => {
            const questionStep = {
              sectionIndex,
              subSectionIndex,
              questionIndex,
              optionIndex: -1,
            }
            iterateeResult = iteratee(question, questionStep)

            // iterate OPTIONS
            if (iterateeResult !== false
              && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(question, questionStep))
            ) {
              question.options && _.forEach(question.options, (option, optionIndex) => {
                const optionsStep = {
                  sectionIndex,
                  subSectionIndex,
                  questionIndex,
                  optionIndex
                }
                iterateeResult = iteratee(option, optionsStep)

                return iterateeResult
              })
            }

            return iterateeResult
          })
        }

        return iterateeResult
      })
    }

    return iterateeResult
  })
}

/**
 * Initialize template with wizard and dependant questions features.
 *
 * Add auxillary `__wizard` property for sections, subSections, questions and options
 * if they have `wizard` property set to `true`.
 *
 * @param {Object}  template            raw template
 * @param {Object}  project             project data (non-flat)
 * @param {Object}  incompleteWizard    incomplete wizard props
 * @param {Boolean} isReadOptimizedMode if true wizard is inited in read optimized mode
 *
 * @returns {Object} initialized template
 */
export const initWizard = (template, project, incompleteWizard, isReadOptimizedMode) => {
  let wizardTemplate = _.cloneDeep(template)
  const isWizardMode = isWizardModeEnabled(wizardTemplate) && !isReadOptimizedMode
  const previousStepVisibility = getPreviousStepVisibility(wizardTemplate)
  // try to get the step where we left the wizard
  const lastWizardStep = incompleteWizard && incompleteWizard.currentWizardStep
  // current step will define the first of the wizard in case we have to start the wizard from the beginning
  let currentWizardStep = {
    sectionIndex: -1,
    subSectionIndex: -1,
    questionIndex: -1,
    optionIndex: -1,
  }
  let prevWizardStep = null

  // initialize wizard for the whole template
  wizardTemplate.__wizard = {
    // there will be the list of all fields which have dependencies in the template
    dependantFields: []
  }

  // initialize wizard for each step
  forEachStep(wizardTemplate, (stepObject, step) => {
    // keep step indexes for each step inside template
    stepObject.__wizard = {
      step
    }

    // add all found variables from condition to the list of dependant fields of the template
    if (stepObject.condition) {
      wizardTemplate.__wizard.dependantFields = _.uniq([
        ...wizardTemplate.__wizard.dependantFields,
        ...getFieldNamesFromExpression(stepObject.condition)
      ])
    }
  })

  const updateResult = updateStepsByConditions(wizardTemplate, project)
  wizardTemplate = updateResult.updatedTemplate

  // in read optimized mode we display all the questions as readOnly if they are not hidden by conditions
  forEachStep(wizardTemplate, (stepObject) => {
    if (isReadOptimizedMode && !stepObject.__wizard.hiddenByCondition) {
      stepObject.__wizard.readOnly = true
    }
  })

  // initialize wizard mode
  if (isWizardMode) {
    currentWizardStep.sectionIndex = 0

    forEachStep(wizardTemplate, (stepObject, step) => {
      stepObject.__wizard.isStep = true
      stepObject.__wizard.hidden = shouldStepBeHidden(previousStepVisibility, step, lastWizardStep)

      // if we reach subSection inside first section, then we will start from it
      if (step.sectionIndex === 0 && currentWizardStep.subSectionIndex === -1 && getStepLevel(step) === LEVEL.SUB_SECTION) {
        currentWizardStep.subSectionIndex = 0
      }

      // if we reach question inside first subSection of the first section, then we will start from it
      if (step.sectionIndex === 0 && step.subSectionIndex === 0 && currentWizardStep.questionIndex === -1 && getStepLevel(step) === LEVEL.QUESTION) {
        currentWizardStep.questionIndex = 0
      }
    }, (stepObject) => (_.get(stepObject, 'wizard.enabled') || stepObject.wizard === true))

    // if we are restoring previously unfinished wizard, we have finalize all steps before the current one
    // in readOnly mode
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

    currentWizardStep = lastWizardStep || currentWizardStep
  }

  return {
    template: wizardTemplate,
    currentWizardStep,
    prevWizardStep,
    isWizardMode,
    previousStepVisibility,
    hasDependantFields: wizardTemplate.__wizard.dependantFields.length > 0
  }
}

/**
 * Gets sign of a number as Math.sign is not cross-browser
 *
 * @param {Number} x number
 *
 * @returns {Number} sign of a number
 */
const sign = (x) => ((x > 0) - (x < 0)) || +x

/**
 * Return direction between two steps
 *
 * @param {Object} step1 step
 * @param {Object} step2 step
 *
 * @returns {String} direction between two steps
 */
const getDirForSteps = (step1, step2) => {
  const optionSign = sign(step2.optionIndex - step1.optionIndex)
  const questionSign = sign(step2.questionIndex - step1.questionIndex)
  const subSectionSign = sign(step2.subSectionIndex - step1.subSectionIndex)
  const sectionSign = sign(step2.sectionIndex - step1.sectionIndex)

  const dir = sectionSign || subSectionSign || questionSign || optionSign

  return dir
}

/**
 * Returns next step in desired direction inside template
 *
 * @param {Object} template    template
 * @param {Object} currentStep current step
 * @param {String} dir         direction
 *
 * @returns {Object} next step in direction
 */
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

/**
 * Returns next step which can be shown in desired direction inside template
 *
 * The difference from `getStepByDir()` is that this method skips steps which are hidden by conditions
 * as such steps won't be visible.
 *
 * @param {Object} template    template
 * @param {Object} currentStep current step
 * @param {String} dir         direction
 *
 * @returns {Object} next step which can be shown in direction
 */
const getStepToShowByDir = (template, currentStep, dir) => {
  let tempStep = currentStep
  let tempStepObject

  do {
    tempStep = getStepByDir(template, tempStep, dir)
    tempStepObject = tempStep && getStepObject(template, tempStep)
  } while (tempStepObject && _.get(tempStepObject, '__wizard.hiddenByCondition'))

  return tempStep
}

/**
 * Returns next step which can be shown inside template
 *
 * @param {Object} template    template
 * @param {Object} currentStep current step
 *
 * @returns {Object} next step which can be shown in direction
 */
export const getNextStepToShow = (template, currentStep) => (
  getStepToShowByDir(template, currentStep, STEP_DIR.NEXT)
)

/**
 * Returns previous step which can be shown inside template
 *
 * @param {Object} template    template
 * @param {Object} currentStep current step
 *
 * @returns {Object} next step which can be shown in direction
 */
export const getPrevStepToShow = (template, currentStep) => (
  getStepToShowByDir(template, currentStep, STEP_DIR.PREV)
)


/**
 * Returns sibling step in desired direction inside template
 *
 * @param {Object} template template
 * @param {Object} step     current step
 * @param {String} dir      direction
 *
 * @returns {Object} sibling step in direction
 */
const getSiblingStepByDir = (template, step, dir) => {
  const level = getStepLevel(step)
  let siblingStep = null

  switch(level) {
  case LEVEL.OPTION:
    siblingStep = {
      ...step,
      optionIndex: step.optionIndex + dir
    }
    break
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

/**
 * Returns next sibling step inside template
 *
 * @param {Object} template template
 * @param {Object} step     current step
 *
 * @returns {Object} next sibling step
 */
const getNextSiblingStep = (template, step) => (
  getSiblingStepByDir(template, step, STEP_DIR.NEXT)
)

/**
 * Returns previous sibling step inside template
 *
 * @param {Object} template template
 * @param {Object} step     current step
 *
 * @returns {Object} previous sibling step
 */
const getPrevSiblingStep = (template, step) => (
  getSiblingStepByDir(template, step, STEP_DIR.PREV)
)

/**
 * Update option in template without template mutation
 *
 * @param {Object} template        template
 * @param {Number} sectionIndex    section index
 * @param {Number} subSectionIndex subSection index
 * @param {Number} questionIndex   question index
 * @param {Number} optionIndex     option index
 * @param {Object} updateRule      rule acceptable by update function
 *
 * @returns {Object} updated template
 */
const updateOption = (template, sectionIndex, subSectionIndex, questionIndex, optionIndex, updateRule) => {
  const section = template.sections[sectionIndex]
  const subSection = section.subSections[subSectionIndex]
  const question = subSection.questions[questionIndex]
  const option = question.options[optionIndex]

  const updatedOption = update(option, updateRule)

  return updateQuestion(template, sectionIndex, subSectionIndex, questionIndex, {
    options: {
      $splice: [[optionIndex, 1, updatedOption]]
    }
  })
}

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

/**
 * Update any kind of step sections, subSection, question or option without template mutation.
 *
 * If level is not defined, it automatically detects the level of step we are updating.
 * If level is defined, it forces to update step on that level.
 *
 * @param {Object} template   template
 * @param {Object} step       section index
 * @param {Object} updateRule rule acceptable by update function
 * @param {String} [level]    step level
 *
 * @returns {Object} updated template
 */
const updateStepObject = (template, step, updateRule, level) => {
  const { sectionIndex, subSectionIndex, questionIndex, optionIndex } = step
  let updatedTemplate = template

  switch (level) {
  case LEVEL.OPTION:
    updatedTemplate = updateOption(template, sectionIndex, subSectionIndex, questionIndex, optionIndex, updateRule)
    break
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
    if (optionIndex !== -1) {
      updatedTemplate = updateOption(template, sectionIndex, subSectionIndex, questionIndex, optionIndex, updateRule)
    } else if (questionIndex !== -1) {
      updatedTemplate = updateQuestion(template, sectionIndex, subSectionIndex, questionIndex, updateRule)
      // if we are updating first question of a sub section, update the sub section as well
      if (questionIndex === 0) {
        updatedTemplate = updateSubSection(updatedTemplate, sectionIndex, subSectionIndex, updateRule)
      }
    } else if (subSectionIndex !== -1) {
      updatedTemplate = updateSubSection(template, sectionIndex, subSectionIndex, updateRule)
    } else if (sectionIndex !== -1) {
      updatedTemplate = updateSection(template, sectionIndex, updateRule)
    }
  }

  return updatedTemplate
}

/**
 * Get step object from template using step (step indexes)
 *
 * If level is not defined, it automatically detects the level of step object to return.
 * If level is defined, it forces to return step object on that level
 *
 * @param {Object} template template
 * @param {Object} step     step
 * @param {String} [level]  step level
 */
export const getStepObject = (template, step, level) => {
  const { section, subSection, question, option } = getStepAllLevelsObjects(template, step)

  switch (level) {
  case LEVEL.OPTION: return option
  case LEVEL.QUESTION: return question
  case LEVEL.SUB_SECTION: return subSection
  case LEVEL.SECTION: return section
  default:
    return option || question || subSection || section
  }
}

/**
 * Get step objects for all level of step.
 *
 * @param {Object} template template
 * @param {Object} step     step
 *
 * @returns {{section: Object, subSection: Object, question: Object, option: Object}} step objects for all levels of step
 */
const getStepAllLevelsObjects = (template, step) => {
  const { sectionIndex, subSectionIndex, questionIndex, optionIndex } = step
  const section = sectionIndex !== -1 ? template.sections[sectionIndex] : null
  const subSection = section && subSectionIndex !== -1 ? section.subSections[subSectionIndex] : null
  const question = subSection && subSection.questions && questionIndex !== -1 ? subSection.questions[questionIndex] : null
  const option = question && question.options && optionIndex !== -1 ? question.options[optionIndex] : null

  return {
    section,
    subSection,
    question,
    option,
  }
}

/**
 * Check if the step is a step on a certain level
 *
 * @param {Object} step  step
 * @param {String} level step level
 *
 * @returns {Boolean} true if step has a certain level
 */
const isStepLevel = (step, level) => {
  if (!step) {
    return false
  }

  const { sectionIndex, subSectionIndex, questionIndex, optionIndex } = step

  switch (level) {
  case LEVEL.OPTION: return optionIndex !== -1 && questionIndex !== -1 && subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.QUESTION: return questionIndex !== -1 && subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.SUB_SECTION: return subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.SECTION: return sectionIndex !== -1
  default: return false
  }
}

/**
 * Get the step level
 *
 * @param {Object} step step
 *
 * @returns {String} step level
 */
const getStepLevel = (step) => {
  if (isStepLevel(step, LEVEL.OPTION)) {
    return LEVEL.OPTION
  }

  if (isStepLevel(step, LEVEL.QUESTION)) {
    return LEVEL.QUESTION
  }

  if (isStepLevel(step, LEVEL.SUB_SECTION)) {
    return LEVEL.SUB_SECTION
  }

  if (isStepLevel(step, LEVEL.SECTION)) {
    return LEVEL.SECTION
  }

  return null
}

/**
 * Get parent step
 *
 * @param {Object} step step
 *
 * @returns {Object} parent step
 */
const getParentStep = (step) => {
  if (step.optionIndex !== -1) {
    return {
      ...step,
      optionIndex: -1
    }
  } else if (step.questionIndex !== -1) {
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

/**
 * Get step children
 *
 * @param {Object} template template
 * @param {Object} step     step
 *
 * @returns {Array} list of children steps
 */
const getStepChildren = (template, step) => {
  const stepObject = getStepObject(template, step)

  return (stepObject.options || stepObject.questions || stepObject.subSections || stepObject.sections || []).map((stepObject) => (
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
export const updateStepsByConditions = (template, project) => {
  let updatedTemplate = template
  let hidedSomeSteps = false
  let updatedSomeSteps = false

  let flatProjectData = flatten(removeValuesOfHiddenSteps(updatedTemplate, project), { safe: true })
  let { stepToUpdate, hiddenByCondition, disabledByCondition } = getStepWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData)
  updatedSomeSteps = !!stepToUpdate
  while (stepToUpdate) {
    const updateRule = {
      __wizard: {}
    }

    if (!_.isUndefined(hiddenByCondition)) {
      updateRule.__wizard.hiddenByCondition = { $set: hiddenByCondition }
    }

    if (!_.isUndefined(disabledByCondition)) {
      updateRule.__wizard.disabledByCondition = { $set: disabledByCondition }
    }

    updatedTemplate = updateStepObject(updatedTemplate, stepToUpdate, updateRule)
    hidedSomeSteps = hidedSomeSteps || hiddenByCondition

    // now get the next step
    flatProjectData = flatten(removeValuesOfHiddenSteps(updatedTemplate, project), { safe: true })
    const prevStep = stepToUpdate
    !({ stepToUpdate, hiddenByCondition, disabledByCondition } = getStepWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData))
    // as conditions in template or some errors in code could potentially lead to infinite loop at this point
    // we check that we are not trying to update the same step again
    // and in case of a loop we stop doing anything without any changes, as it's better than hang user's browser
    if (stepToUpdate && getDirForSteps(prevStep, stepToUpdate) === STEP_DIR.SAME) {
      console.error(`Infinite loop during updating step by condition ${JSON.stringify(stepToUpdate)}.`, updatedTemplate)
      return {
        template,
        hidedSomeSteps: false,
        updatedSomeSteps: false,
      }
    }
  }

  return {
    updatedTemplate,
    hidedSomeSteps,
    updatedSomeSteps,
  }
}

/**
 * Removes values of the fields which are hidden by conditions from project data
 *
 * @param {Object} template template
 * @param {Object} project  project data (non-flat)
 *
 * @returns {Object} project data without data of hidden fields
 */
export const removeValuesOfHiddenSteps = (template, project) => {
  let updatedProject = project

  forEachStep(template, (stepObject, step) => {
    const level = getStepLevel(step)

    switch(level) {
    // if some question is hidden, we remove it's value from the project data
    case LEVEL.QUESTION:
      if (stepObject.__wizard.hiddenByCondition && _.get(updatedProject, stepObject.fieldName)) {
        updatedProject = update(updatedProject, unflatten({
          [stepObject.fieldName]: { $set: undefined }
        }))
      }
      break

    // if some option is hidden, we remove it's value from the list of values of the parent question
    case LEVEL.OPTION: {
      if (stepObject.__wizard.hiddenByCondition) {
        const questionStep = {...step, optionIndex: -1}
        const questionStepObject = getStepObject(template, questionStep)
        const questionValue = _.get(updatedProject, questionStepObject.fieldName)

        if (questionValue && _.isArray(questionValue)) {
          const optionValueIndex = questionValue.indexOf(stepObject.value)

          if (optionValueIndex > - 1) {
            updatedProject = update(updatedProject, unflatten({
              [questionStepObject.fieldName]: { $splice: [[optionValueIndex, 1]] }
            }))
          }
        }
      }
      break
    }
    }
  })

  return updatedProject
}

/**
 * Returns first found step (only one) which has to be updated by condition
 *
 * @param {Object} template        template
 * @param {Object} flatProjectData project data (flat)
 *
 * @returns {Object} step
 */
const getStepWhichMustBeUpdatedByCondition = (template, flatProjectData) => {
  const result = {
    stepToUpdate: null
  }

  forEachStep(template, (stepObject, step) => {
    if (stepObject.condition) {
      const hiddenByCondition = !evaluate(stepObject.condition, flatProjectData)

      // only update if the condition result has changed
      if (hiddenByCondition !== stepObject.__wizard.hiddenByCondition) {
        result.stepToUpdate = step
        result.hiddenByCondition = hiddenByCondition
      }
    }

    if (stepObject.disableCondition) {
      const disabledByCondition = evaluate(stepObject.disableCondition, flatProjectData)

      // only update if the condition result has changed
      if (disabledByCondition !== stepObject.__wizard.disabledByCondition) {
        result.stepToUpdate = step
        result.disabledByCondition = disabledByCondition
      }
    }

    return !result.stepToUpdate
  })

  return result
}

/**
 * Finalize/unfinalize step
 *
 * When we've done with step we want to finalize it as per previousStepVisibility hide or make it read-only.
 * This method does it. It also can the reverse operation if `value` is defined as `false`
 *
 * @param {Object}  template template
 * @param {Object}  step     step
 * @param {Boolean} value
 *
 * @returns {Object} updated template
 */
const finalizeStep = (template, step, value = true) => {
  let updatedTemplate = template

  const previousStepVisibility = getPreviousStepVisibility(template)
  const stepObject = getStepObject(updatedTemplate, step)

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

/**
 * Update template so the next step in defined direction is shown
 *
 * @param {Object} template    template
 * @param {Object} currentStep current step
 * @param {String} dir         direction
 *
 * @returns {Object} updated template
 */
export const showStepByDir = (template, currentStep, dir) => {
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

/**
 * Update template so we show the `destinationStep` instead of `currentStep`
 *
 * @param {Object} template        template
 * @param {Object} currentStep     current step
 * @param {Object} destinationStep destinationStep
 *
 * @returns {Object} updated template
 */
export const rewindToStep = (template, currentStep, destinationStep) => {
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

/**
 * Determines if step has dependant steps
 *
 * @param {Object} template template
 * @param {Object} step     template
 *
 * @returns {Boolean} true if step has any dependant steps
 */
export const isStepHasDependencies = (template, step) => {
  const stepObject = getStepObject(template, step)

  return _.includes(_.get(template, '__wizard.dependantFields', []), stepObject.fieldName)
}

/**
 * Check if step is defined as a step in wizard.
 *
 * @param {Object} template template
 * @param {Object} step     step
 *
 * @returns {Boolean} true if step is defined as a step in wizard
 */
export const findRealStep = (template, step) => {
  let tempStep = step
  let tempStepObject = getStepObject(template, tempStep)

  while (tempStep && !_.get(tempStepObject, '__wizard.isStep')) {
    tempStep = getParentStep(tempStep)
    tempStepObject = getStepObject(template, tempStep)
  }

  return tempStep
}

/**
 * Update template so the `step` is showed as editable (non read-only)
 *
 * @param {Object} template template
 * @param {Object} step     step
 *
 * @returns {Object} updated template
 */
export const makeStepEditable = (template, step) => {
  let updatedTemplate = template

  updatedTemplate = updateStepObject(updatedTemplate, step, {
    __wizard: {
      readOnly: { $set: false },
      editReadOnly: { $set: true }
    }
  })

  return updatedTemplate
}


/**
 * Update template so the `step` is showed as read-only
 *
 * @param {Object} template template
 * @param {Object} step     step
 *
 * @returns {Object} updated template
 */
export const makeStepReadonly = (template, step) => {
  let updatedTemplate = template

  updatedTemplate = updateStepObject(updatedTemplate, step, {
    __wizard: {
      readOnly: { $set: true },
      editReadOnly: { $set: false }
    }
  })

  return updatedTemplate
}

/**
 * Finds next either sibling or ancestor step
 *
 * @param {Object} template template
 * @param {Object} step     step
 *
 * @returns {Object} step
 */
const getNextSiblingOrAncestorStep = (template, step) => {
  const sibling = getNextSiblingStep(template, step)

  if (sibling) {
    return sibling
  }

  const children = getStepChildren(template, step)

  if (children.length > 0) {
    return children[0]
  }

  return null
}

/**
 * Adds data which manged by the step to the snapshot
 *
 * @param {Object} snapshot snapshot
 * @param {Object} template template
 * @param {Object} step      tep
 * @param {Object} flatData flat data
 */
const saveStepDataToSnapshot = (snapshot, template, step, flatData) => {
  const stepObject = getStepObject(template, step)

  // is some step is not a field, don't save anything
  if (!stepObject.fieldName) {
    return
  }

  snapshot[stepObject.fieldName] = flatData[stepObject.fieldName]

  // as some types of subSections has multiple values we have to save them too
  const refCodeFieldName = 'details.utm.code'
  const businessUnitFieldName = 'details.businessUnit'
  const costCentreFieldName = 'details.costCentre'

  switch(stepObject.type) {
  case 'project-name':
    snapshot[refCodeFieldName] = flatData[refCodeFieldName]
    break
  case 'project-name-advanced':
    snapshot[refCodeFieldName] = flatData[refCodeFieldName]
    snapshot[businessUnitFieldName] = flatData[businessUnitFieldName]
    snapshot[costCentreFieldName] = flatData[costCentreFieldName]
    break
  default:break
  }
}

/**
 * Adds snapshot of data of the provided "real step"
 *
 * @param {Array}  snapshotsStorage array to store snapshots
 * @param {Object} step             step
 * @param {Object} template         template
 * @param {Object} flatData         flat data
 */
export const pushStepDataSnapshot = (snapshotsStorage, step, template, flatData) => {
  const snapshot = {}

  saveStepDataToSnapshot(snapshot, template, step, flatData)

  const children = getStepChildren(template, step)
  if (children.length > 0 && !isStepLevel(children[0], LEVEL.OPTION)) {
    let tempStep = children[0]

    do {
      saveStepDataToSnapshot(snapshot, template, tempStep, flatData)

      tempStep = getNextSiblingOrAncestorStep(template, tempStep)
    } while (tempStep)
  }

  snapshotsStorage.push({
    step,
    snapshot,
  })
}

/**
 * Pop snapshot of data of the provided "real step"
 *
 * It removes data form `snapshotsStorage` and returns it
 *
 * @param {Array}  snapshotsStorage array to store snapshots
 * @param {Object} step             step
 * @param {Object} template         template
 * @param {Object} flatData         flat data
 *
 * @returns {Object} snapshot
 */
export const popStepDataSnapshot = (snapshotsStorage, step) => {
  const savedDataIndex = snapshotsStorage.findIndex((item) => _.isEqual(item.step, step))
  const savedData = savedDataIndex !== -1 ? snapshotsStorage[savedDataIndex] : null
  snapshotsStorage.splice(savedDataIndex, 1)

  return savedData ? savedData.snapshot : null
}
