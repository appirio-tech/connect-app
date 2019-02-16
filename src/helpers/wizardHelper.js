/**
 * Helper methods for project creation/edition wizard mode and conditional questions.
 *
 * The main idea behind wizard helper is that it's a set of methods which contain all the wizard logic,
 * and these methods can update projectTemplate.scope which is used to render the form.
 * The form rendering component doesn't contain any wizard logic, it just renders projectTemplate.scope which
 * was processed by the methods in this helper.
 *
 * Glossary:
 *   - `node`: we call any section, subSection, question or option
 *             node is defined as an object with indexes:
 *             {
 *                sectionIndex: Number,
 *                subSectionIndex: Number,
 *                questionIndex: Number,
 *                optionIndex: Number,
 *             }
 *             If some index is not applicable it has to be defined as -1.
 *   - `nodeObject`: it's an actual section, subSection, question or option object
 *   - `step`: is a particular case of node which has to be shown as one single step in wizard
 */
import _ from 'lodash'
import update from 'react-addons-update'
import { evaluate, getFieldNamesFromExpression } from './dependentQuestionsHelper'
import { flatten, unflatten } from 'flat'

/**
 * Defines possible ways of displaying steps
 */
export const STEP_VISIBILITY = {
  NONE: 'none',
  WRITE: 'write',
  READ_OPTIMIZED: 'readOptimized',
}

/**
 * Form template has many levels, and this constant define them
 */
export const LEVEL = {
  UNDEFINED: undefined,
  SECTION: 'section',
  SUB_SECTION: 'subSection',
  QUESTION: 'question',
  OPTION: 'option'
}

/**
 * Defines possible wizard state values
 *
 * - `prev` - all passed steps
 * - `current`
 * - `next` - all next steps
 */
export const STEP_STATE = {
  PREV: 'prev',
  CURRENT: 'current',
  NEXT: 'next'
}

/**
 * Define relation between nodes
 * - the node is next to another one
 * - the node previous to another one
 * - it's a same node
 */
export const NODE_DIR = {
  NEXT: +1,
  PREV: -1,
  SAME: 0,
}

const DEFAULT_STEP_VISIBILITY = STEP_VISIBILITY.WRITE

const CURRENT_STEP_VISIBILITY = STEP_VISIBILITY.WRITE

const NEXT_STEP_VISIBILITY = STEP_VISIBILITY.NONE

/**
 * Get previous step visibility for the node
 *
 * @param {Object} template template
 * @param {Object} node     node
 *
 * @returns {String} step visibility
 */
const getPreviousStepVisibility = (template, node) => {
  const level = getNodeLevel(node)
  const parentNode = getParentNode(node)
  const parentNodeObject = level === LEVEL.SECTION ? template : getNodeObject(template, parentNode)

  return _.get(parentNodeObject, 'wizard.previousStepVisibility', DEFAULT_STEP_VISIBILITY)
}

/**
 * Get node state in wizard.
 * Other words if this is any previous node, current node or any next node in wizard workflow.
 *
 * @param {Object} nodeObject        node object
 * @param {Object} currentWizardStep current wizard step
 *
 * @returns {String} node state
 */
export const geStepState = (nodeObject, currentWizardStep) => {
  const node = _.get(nodeObject, '__wizard.node')

  // this means that we are not in a wizard mode, because it was not initialized for this node
  if (!node) {
    return null
  }

  if (
    isSameOrParentNode(currentWizardStep, node) ||
    isSameOrParentNode(node, currentWizardStep)
  ) {
    return STEP_STATE.CURRENT
  }

  if (isPreviousStep(node, currentWizardStep)) {
    return STEP_STATE.PREV
  }

  if (isNextStep(node, currentWizardStep)) {
    return STEP_STATE.NEXT
  }

  // this should never happen
  console.error('Cannot determine node state, something went wrong.')
  return null
}

/**
 *
 * @param {Object} template          template
 * @param {Object} nodeObject        node object
 * @param {Object} currentWizardStep current wizard step
 *
 * @returns {String} step visibility
 */
export const getVisibilityForRendering = (template, nodeObject, currentWizardStep) => {
  const node = _.get(nodeObject, '__wizard.node')

  // this means that we are not in a wizard mode, because it was not initialized for this node
  if (!node) {
    return DEFAULT_STEP_VISIBILITY
  }

  const stepState = geStepState(nodeObject, currentWizardStep)
  let stepVisibility = DEFAULT_STEP_VISIBILITY

  switch(stepState) {
  case STEP_STATE.PREV: stepVisibility = getPreviousStepVisibility(template, node)
    break
  case STEP_STATE.CURRENT: stepVisibility = CURRENT_STEP_VISIBILITY
    break
  case STEP_STATE.NEXT: stepVisibility = NEXT_STEP_VISIBILITY
    break
  }

  return stepVisibility
}

/**
 * Determines if the `sameOrParentNode` node is same or parent node to `node`.
 *
 * @param {Object} node             node
 * @param {Object} sameOrParentNode same or parent node
 *
 * @returns {Boolean} is same or parent
 */
const isSameOrParentNode = (node, sameOrParentNode) => {
  let isSameOrParent = true

  if (node.optionIndex !== -1) {
    isSameOrParent = isSameOrParent && (sameOrParentNode.optionIndex === -1 || sameOrParentNode.optionIndex === node.optionIndex)
  }

  if (node.questionIndex !== -1) {
    isSameOrParent = isSameOrParent && (sameOrParentNode.questionIndex === -1 || sameOrParentNode.questionIndex === node.questionIndex)
  }

  if (node.subSectionIndex !== -1) {
    isSameOrParent = isSameOrParent && (sameOrParentNode.subSectionIndex === -1 || sameOrParentNode.subSectionIndex === node.subSectionIndex)
  }

  if (node.sectionIndex !== -1) {
    isSameOrParent = isSameOrParent && (sameOrParentNode.sectionIndex === -1 || sameOrParentNode.sectionIndex === node.sectionIndex)
  }

  return isSameOrParent
}

/**
 * Calculate wizard progress.
 *
 * @param {Object} template template
 * @param {Object} currentWizardStep current wizard step
 *
 * @returns {Number} progress [0, 1]
 */
export const getWizardProgress = (template, currentWizardStep) => {
  let sectionsProgress = 0
  let subSectionsProgress = 0
  let questionsProgress = 0

  const { section, subSection } = getNodeAllLevelsObjects(template, currentWizardStep)

  if (currentWizardStep.sectionIndex !== -1 && _.get(template, 'wizard.enabled')) {
    sectionsProgress = currentWizardStep.sectionIndex / template.sections.length
  }

  if (currentWizardStep.subSectionIndex !== -1 && _.get(section, 'wizard.enabled')) {
    subSectionsProgress = currentWizardStep.subSectionIndex / section.subSections.length
    subSectionsProgress = subSectionsProgress / template.sections.length
  }

  if (currentWizardStep.questionIndex !== -1 && _.get(subSection, 'wizard.enabled')) {
    questionsProgress = currentWizardStep.questionIndex / subSection.questions.length
    questionsProgress = questionsProgress / section.subSections.length
    questionsProgress = questionsProgress / template.sections.length
  }

  return sectionsProgress + subSectionsProgress + questionsProgress
}

export const isPreviousStep = (step, currentStep) => (
  getDirForNodes(step, currentStep) === NODE_DIR.NEXT
)

export const isNextStep = (step, currentStep) => (
  getDirForNodes(step, currentStep) === NODE_DIR.PREV
)

/**
 * Iterates through all the nodes of the template: sections, subSections, questions, options.
 *
 * If iteratee returns `false` iteration will be stopped.
 *
 * @param {Object}   template template
 * @param {Function} iteratee function which is called for each node with signature (nodeObject, node)
 * @param {Function} [iterateSublevelCondition] if returns false, we don't iterate through the nodes of the child level
 */
export const forEachNode = (template, iteratee, iterateSublevelCondition) => {
  let iterateeResult

  // iterate SECTIONS
  _.forEach(template.sections, (section, sectionIndex) => {
    const sectionNode = {
      sectionIndex,
      subSectionIndex: -1,
      questionIndex: -1,
      optionIndex: -1,
    }
    iterateeResult = iteratee(section, sectionNode)

    // iterate SUB_SECTIONS
    if (iterateeResult !== false
      && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(section, sectionNode))
    ) {
      _.forEach(section.subSections, (subSection, subSectionIndex) => {
        const subSectionNode = {
          sectionIndex,
          subSectionIndex,
          questionIndex: -1,
          optionIndex: -1,
        }
        iterateeResult = iteratee(subSection, subSectionNode)

        // iterate QUESTIONS
        if (iterateeResult !== false
          && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(subSection, subSectionNode))
        ) {
          subSection.questions && _.forEach(subSection.questions, (question, questionIndex) => {
            const questionNode = {
              sectionIndex,
              subSectionIndex,
              questionIndex,
              optionIndex: -1,
            }
            iterateeResult = iteratee(question, questionNode)

            // iterate OPTIONS
            if (iterateeResult !== false
              && (!_.isFunction(iterateSublevelCondition) || iterateSublevelCondition(question, questionNode))
            ) {
              question.options && _.forEach(question.options, (option, optionIndex) => {
                const optionsNode = {
                  sectionIndex,
                  subSectionIndex,
                  questionIndex,
                  optionIndex
                }
                iterateeResult = iteratee(option, optionsNode)

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
 * @param {Boolean} editMode            init form in edit mode
 *
 * @returns {Object} initialized template
 */
export const initWizard = (template, project, incompleteWizard, editMode = false) => {
  let wizardTemplate = _.cloneDeep(template)
  const isWizardMode = _.get(template, 'wizard.enabled')
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

  // initialize wizard for each node
  forEachNode(wizardTemplate, (nodeObject, node) => {
    // keep node indexes for each node inside template
    nodeObject.__wizard = {
      node
    }

    // add all found variables from condition to the list of dependant fields of the template
    if (nodeObject.condition) {
      wizardTemplate.__wizard.dependantFields = _.uniq([
        ...wizardTemplate.__wizard.dependantFields,
        ...getFieldNamesFromExpression(nodeObject.condition)
      ])
    }
  })

  const updateResult = updateNodesByConditions(wizardTemplate, project)
  wizardTemplate = updateResult.updatedTemplate

  // initialize wizard mode
  if (isWizardMode) {
    currentWizardStep.sectionIndex = 0

    forEachNode(wizardTemplate, (nodeObject, node) => {
      nodeObject.__wizard.isStep = true

      // if we reach subSection inside first section, then we will start from it
      if (node.sectionIndex === 0 && currentWizardStep.subSectionIndex === -1 && getNodeLevel(node) === LEVEL.SUB_SECTION) {
        currentWizardStep.subSectionIndex = 0
      }

      // if we reach question inside first subSection of the first section, then we will start from it
      if (node.sectionIndex === 0 && node.subSectionIndex === 0 && currentWizardStep.questionIndex === -1 && getNodeLevel(node) === LEVEL.QUESTION) {
        currentWizardStep.questionIndex = 0
      }
    }, (nodeObject) => (_.get(nodeObject, 'wizard.enabled') || nodeObject.wizard === true))

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
 * Return direction between two nodes
 *
 * @param {Object} node1 node
 * @param {Object} node2 node
 *
 * @returns {String} direction between two nodes
 */
const getDirForNodes = (node1, node2) => {
  const optionSign = sign(node2.optionIndex - node1.optionIndex)
  const questionSign = sign(node2.questionIndex - node1.questionIndex)
  const subSectionSign = sign(node2.subSectionIndex - node1.subSectionIndex)
  const sectionSign = sign(node2.sectionIndex - node1.sectionIndex)

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
  // as per current design a sibling node of the step is always also a step
  let siblingStep = getSiblingNodeByDir(template, currentStep, dir)

  // if there is no sibling
  // checking siblings of parent levels
  let tempNode = currentStep
  while (!siblingStep && (tempNode = getParentNode(tempNode))) {
    const parentNodeObject = getNodeObject(template, tempNode)

    if (_.get(parentNodeObject, '__wizard.isStep')) {
      siblingStep = getSiblingNodeByDir(template, tempNode, dir)
    }
  }

  // no matter where we got step: between the sibling of the current step
  // or between siblings of the parent levels
  // try to find the most inner step inside the possible step
  if (siblingStep) {
    let tempNode = siblingStep

    while (_.get(getNodeObject(template, tempNode), 'wizard.enabled')) {
      const childrenNodes = getNodeChildren(template, tempNode)

      const childStepIndex = dir === NODE_DIR.NEXT ? 0 : childrenNodes.length - 1

      if (childrenNodes[childStepIndex]) {
        tempNode = childrenNodes[childStepIndex]
      }
    }

    return tempNode
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
export const getStepToShowByDir = (template, currentStep, dir) => {
  let tempNode = currentStep
  let tempNodeObject

  do {
    tempNode = getStepByDir(template, tempNode, dir)
    tempNodeObject = tempNode && getNodeObject(template, tempNode)
  } while (tempNodeObject && _.get(tempNodeObject, '__wizard.hiddenByCondition'))

  return tempNode
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
  getStepToShowByDir(template, currentStep, NODE_DIR.NEXT)
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
  getStepToShowByDir(template, currentStep, NODE_DIR.PREV)
)


/**
 * Returns sibling node in desired direction inside template
 *
 * @param {Object} template template
 * @param {Object} node     current node
 * @param {String} dir      direction
 *
 * @returns {Object} sibling step in direction
 */
const getSiblingNodeByDir = (template, node, dir) => {
  const level = getNodeLevel(node)
  let siblingNode = null

  switch(level) {
  case LEVEL.OPTION:
    siblingNode = {
      ...node,
      optionIndex: node.optionIndex + dir
    }
    break
  case LEVEL.QUESTION:
    siblingNode = {
      ...node,
      questionIndex: node.questionIndex + dir
    }
    break
  case LEVEL.SUB_SECTION:
    siblingNode = {
      ...node,
      subSectionIndex: node.subSectionIndex + dir
    }
    break
  case LEVEL.SECTION:
    siblingNode = {
      ...node,
      sectionIndex: node.sectionIndex + dir
    }
    break
  default: siblingNode = null
  }

  if (siblingNode && getNodeObject(template, siblingNode, level)) {
    return siblingNode
  } else {
    return null
  }
}

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
 * Update any kind of node sections, subSection, question or option without template mutation.
 *
 * If level is not defined, it automatically detects the level of node we are updating.
 * If level is defined, it forces to update node on that level.
 *
 * @param {Object} template   template
 * @param {Object} node       section index
 * @param {Object} updateRule rule acceptable by update function
 * @param {String} [level]    node level
 *
 * @returns {Object} updated template
 */
const updateNodeObject = (template, node, updateRule, level) => {
  const { sectionIndex, subSectionIndex, questionIndex, optionIndex } = node
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
    } else if (subSectionIndex !== -1) {
      updatedTemplate = updateSubSection(template, sectionIndex, subSectionIndex, updateRule)
    } else if (sectionIndex !== -1) {
      updatedTemplate = updateSection(template, sectionIndex, updateRule)
    }
  }

  return updatedTemplate
}

/**
 * Get node object from template using node (node indexes)
 *
 * If level is not defined, it automatically detects the level of node object to return.
 * If level is defined, it forces to return node object on that level
 *
 * @param {Object} template template
 * @param {Object} node     node
 * @param {String} [level]  node level
 */
export const getNodeObject = (template, node, level) => {
  const { section, subSection, question, option } = getNodeAllLevelsObjects(template, node)

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
 * Get node objects for all level of node.
 *
 * @param {Object} template template
 * @param {Object} node     node
 *
 * @returns {{section: Object, subSection: Object, question: Object, option: Object}} node objects for all levels of node
 */
const getNodeAllLevelsObjects = (template, node) => {
  const { sectionIndex, subSectionIndex, questionIndex, optionIndex } = node
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
 * Check if the node is a node on a certain level
 *
 * @param {Object} node  node
 * @param {String} level node level
 *
 * @returns {Boolean} true if node has a certain level
 */
const isNodeLevel = (node, level) => {
  if (!node) {
    console.error('Node has to be an object.')
    return false
  }

  const { sectionIndex, subSectionIndex, questionIndex, optionIndex } = node

  switch (level) {
  case LEVEL.OPTION: return optionIndex !== -1 && questionIndex !== -1 && subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.QUESTION: return questionIndex !== -1 && subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.SUB_SECTION: return subSectionIndex !== -1 && sectionIndex !== -1
  case LEVEL.SECTION: return sectionIndex !== -1
  default: return false
  }
}

/**
 * Get the node level
 *
 * @param {Object} node node
 *
 * @returns {String} node level
 */
const getNodeLevel = (node) => {
  if (isNodeLevel(node, LEVEL.OPTION)) {
    return LEVEL.OPTION
  }

  if (isNodeLevel(node, LEVEL.QUESTION)) {
    return LEVEL.QUESTION
  }

  if (isNodeLevel(node, LEVEL.SUB_SECTION)) {
    return LEVEL.SUB_SECTION
  }

  if (isNodeLevel(node, LEVEL.SECTION)) {
    return LEVEL.SECTION
  }

  return LEVEL.UNDEFINED
}

/**
 * Get parent node
 *
 * @param {Object} node node
 *
 * @returns {Object} parent node
 */
const getParentNode = (node) => {
  if (node.optionIndex !== -1) {
    return {
      ...node,
      optionIndex: -1
    }
  } else if (node.questionIndex !== -1) {
    return {
      ...node,
      questionIndex: -1
    }
  } else if (node.subSectionIndex !== -1) {
    return {
      ...node,
      subSectionIndex: -1
    }
  } else if (node.sectionIndex !== -1) {
    return {
      ...node,
      sectionIndex: -1
    }
  } else {
    return null
  }
}

/**
 * Get node children
 *
 * @param {Object} template template
 * @param {Object} node     node
 *
 * @returns {Array} list of children nodes
 */
const getNodeChildren = (template, node) => {
  const nodeObject = getNodeObject(template, node)

  return (nodeObject.options || nodeObject.questions || nodeObject.subSections || nodeObject.sections || []).map((nodeObject) => (
    _.get(nodeObject, '__wizard.node')
  ))
}

/**
 * Update questions in template using question conditions and data
 *
 * @param {Object} template template
 * @param {Object} project  data to evaluate question conditions
 *
 * @returns {Object} updated template
 */
export const updateNodesByConditions = (template, project) => {
  let updatedTemplate = template
  let hidedSomeNodes = false
  let updatedSomeNodes = false

  let flatProjectData = flatten(removeValuesOfHiddenNodes(updatedTemplate, project), { safe: true })
  let { nodeToUpdate, hiddenByCondition, disabledByCondition } = getNodeWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData)
  updatedSomeNodes = !!nodeToUpdate
  while (nodeToUpdate) {
    const updateRule = {
      __wizard: {}
    }

    if (!_.isUndefined(hiddenByCondition)) {
      updateRule.__wizard.hiddenByCondition = { $set: hiddenByCondition }
    }

    if (!_.isUndefined(disabledByCondition)) {
      updateRule.__wizard.disabledByCondition = { $set: disabledByCondition }
    }

    updatedTemplate = updateNodeObject(updatedTemplate, nodeToUpdate, updateRule)
    hidedSomeNodes = hidedSomeNodes || hiddenByCondition

    // now get the next node
    flatProjectData = flatten(removeValuesOfHiddenNodes(updatedTemplate, project), { safe: true })
    const prevNode = nodeToUpdate
    !({ nodeToUpdate, hiddenByCondition, disabledByCondition } = getNodeWhichMustBeUpdatedByCondition(updatedTemplate, flatProjectData))
    // as conditions in template or some errors in code could potentially lead to infinite loop at this point
    // we check that we are not trying to update the same node again
    // and in case of a loop we stop doing anything without any changes, as it's better than hang user's browser
    if (nodeToUpdate && getDirForNodes(prevNode, nodeToUpdate) === NODE_DIR.SAME) {
      console.error(`Infinite loop during updating node by condition ${JSON.stringify(nodeToUpdate)}.`, updatedTemplate)
      return {
        template,
        hidedSomeNodes: false,
        updatedSomeNodes: false,
      }
    }
  }

  return {
    updatedTemplate,
    hidedSomeNodes,
    updatedSomeNodes,
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
export const removeValuesOfHiddenNodes = (template, project) => {
  let updatedProject = project

  forEachNode(template, (nodeObject, node) => {
    const level = getNodeLevel(node)

    switch(level) {
    // if some question is hidden, we remove it's value from the project data
    case LEVEL.QUESTION:
      if (_.get(nodeObject, '__wizard.hiddenByCondition') && _.get(updatedProject, nodeObject.fieldName)) {
        updatedProject = update(updatedProject, unflatten({
          [nodeObject.fieldName]: { $set: undefined }
        }))
      }
      break

    // if some option is hidden, we remove it's value from the list of values of the parent question
    case LEVEL.OPTION: {
      if (_.get(nodeObject, 'nodeObject.__wizard.hiddenByCondition')) {
        const questionNode = {...node, optionIndex: -1}
        const questionNodeObject = getNodeObject(template, questionNode)
        const questionValue = _.get(updatedProject, questionNodeObject.fieldName)

        if (questionValue && _.isArray(questionValue)) {
          const optionValueIndex = questionValue.indexOf(nodeObject.value)

          if (optionValueIndex > - 1) {
            updatedProject = update(updatedProject, unflatten({
              [questionNodeObject.fieldName]: { $splice: [[optionValueIndex, 1]] }
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
 * Returns first found node (only one) which has to be updated by condition
 *
 * @param {Object} template        template
 * @param {Object} flatProjectData project data (flat)
 *
 * @returns {Object} node
 */
const getNodeWhichMustBeUpdatedByCondition = (template, flatProjectData) => {
  const result = {
    nodeToUpdate: null
  }

  forEachNode(template, (nodeObject, node) => {
    if (nodeObject.condition) {
      const hiddenByCondition = !evaluate(nodeObject.condition, flatProjectData)

      // only update if the condition result has changed
      if (hiddenByCondition !== nodeObject.__wizard.hiddenByCondition) {
        result.nodeToUpdate = node
        result.hiddenByCondition = hiddenByCondition
      }
    }

    if (nodeObject.disableCondition) {
      const disabledByCondition = evaluate(nodeObject.disableCondition, flatProjectData)

      // only update if the condition result has changed
      if (disabledByCondition !== nodeObject.__wizard.disabledByCondition) {
        result.nodeToUpdate = node
        result.disabledByCondition = disabledByCondition
      }
    }

    return !result.nodeToUpdate
  })

  return result
}
