/**
 * Helper methods for project creation/edition wizard mode and conditional questions.
 */
import _ from 'lodash'
import update from 'react-addons-update'
import { evaluate, getFieldNamesFromExpression } from './dependentQuestionsHelper'
import { flatten, unflatten } from 'flat'

export const PREVIOUS_STEP_VISIBILITY = {
  NONE: 'none',
  READ_ONLY: 'readOnly',
  WRITE: 'write',
}

export const LEVEL = {
  SECTION: 'section',
  SUB_SECTION: 'subSection',
  QUESTION: 'question'
}

export const STEP_DIR = {
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

export const isWizardModeEnabled = (template) => (
  _.get(template, 'wizard.enabled') || template.wizard === true
)

export const getPreviousStepVisibility = (template) => (
  _.get(template, 'wizard.previousStepVisibility', PREVIOUS_STEP_VISIBILITY.WRITE)
)

export const forEachStep = (template, iteratee, iterateSublevelCondition) => {
  _.forEach(template.sections, (section, sectionIndex) => {
    const sectionStep = {
      sectionIndex,
      subSectionIndex: -1,
      questionIndex: -1
    }
    const sectionResult = iteratee(section, sectionStep)

    if (sectionResult !== false
      && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(section, sectionStep))
    ) {
      _.forEach(section.subSections, (subSection, subSectionIndex) => {
        const subSectionStep = {
          sectionIndex,
          subSectionIndex,
          questionIndex: -1
        }
        const subSectionResult = iteratee(subSection, subSectionStep)

        if (subSectionResult !== false
          && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(subSection, subSectionStep))
        ) {
          subSection.questions && _.forEach(subSection.questions, (question, questionIndex) => {
            return iteratee(question, {
              sectionIndex,
              subSectionIndex,
              questionIndex
            })
          })
        }

        return subSectionResult
      })
    }

    return sectionResult
  })
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
export const initWizard = (template, project, incompleteWizard, isReadOptimizedMode) => {
  let wizardTemplate = _.cloneDeep(template)
  const isWizardMode = isWizardModeEnabled(wizardTemplate) && !isReadOptimizedMode
  const previousStepVisibility = getPreviousStepVisibility(wizardTemplate)
  const flatProjectData = flatten(project, { safe: true })
  // try to get the step where we left the wizard
  const lastWizardStep = incompleteWizard && incompleteWizard.currentWizardStep
  // current step will define the first of the wizard in case we have to start the wizard from the beginning
  let currentWizardStep = {
    sectionIndex: -1,
    subSectionIndex: -1,
    questionIndex: -1,
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

    // if step has condition, evaluate it
    if (stepObject.condition) {
      stepObject.__wizard.hiddenByCondition = !evaluate(stepObject.condition, flatProjectData)

      // add all found variables from condition to the list of dependant fields of the template
      wizardTemplate.__wizard.dependantFields = _.uniq([
        ...wizardTemplate.__wizard.dependantFields,
        ...getFieldNamesFromExpression(stepObject.condition)
      ])
    }

    // in read optimized mode we display all the questions as readOnly if they are not hidden by conditions
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

  console.warn('wizardTemplate', wizardTemplate)

  return {
    template: wizardTemplate,
    currentWizardStep,
    prevWizardStep,
    isWizardMode,
    previousStepVisibility,
    hasDependantFields: wizardTemplate.__wizard.dependantFields.length > 0
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

export const getNextStepToShow = (template, currentStep) => (
  getStepToShowByDir(template, currentStep, STEP_DIR.NEXT)
)

export const getPrevStepToShow = (template, currentStep) => (
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

export const getStepObject = (template, step, level) => {
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
export const updateQuestionsByConditions = (template, project) => {
  let updatedTemplate = template
  let hidedSomeQuestions = false
  let updatedSomeQuestions = false

  let flatProjectData = flatten(removeValuesOfHiddenQuestions(updatedTemplate, project), { safe: true })
  let { questionToUpdate, hiddenByCondition } = getQuestionWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData)
  updatedSomeQuestions = !!questionToUpdate
  while (questionToUpdate) {
    updatedTemplate = updateStepObject(updatedTemplate, questionToUpdate, {
      __wizard: {
        hiddenByCondition: { $set: hiddenByCondition }
      }
    })

    flatProjectData = flatten(removeValuesOfHiddenQuestions(updatedTemplate, project), { safe: true })
    const nextQuestionToUpdate = getQuestionWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData)
    questionToUpdate = nextQuestionToUpdate.questionToUpdate
    hiddenByCondition = nextQuestionToUpdate.hiddenByCondition

    hidedSomeQuestions = hidedSomeQuestions || hiddenByCondition
  }

  return {
    updatedTemplate,
    hidedSomeQuestions,
    updatedSomeQuestions,
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

export const isStepHasDependencies = (template, step) => {
  const stepObject = getStepObject(template, step)

  return _.includes(_.get(template, '__wizard.dependantFields', []), stepObject.fieldName)
}

export const findRealStep = (template, step) => {
  let tempStep = step
  let tempStepObject = getStepObject(template, tempStep)

  while (tempStep && !_.get(tempStepObject, '__wizard.isStep')) {
    tempStep = getParentStep(tempStep)
    tempStepObject = getStepObject(template, tempStep)
  }

  return tempStep
}

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
