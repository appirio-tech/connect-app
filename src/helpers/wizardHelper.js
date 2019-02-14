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
 *             If some index is not applicable it has be defined as -1.
 *   - `nodeObject`: it's an actual section, subSection, question or option object
 *   - `step`: is a particular case of node which has to be shown as one single step in wizard
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

/**
 * Determines if node has to be hidden during wizard initialization
 *
 * @param {String} previousStepVisibility previous step visibility in wizard
 * @param {Object} currentNode            the node which we iterate
 * @param {Object} lastWizardStep         the last step which was previously filled
 *
 * @returns {Boolean} true if node has to be hidden
 */
const shouldNodeBeHidden = (previousStepVisibility, currentNode, lastWizardStep) => {
  if (!lastWizardStep) {
    const level = getNodeLevel(currentNode)
    return currentNode[`${level}Index`] !== 0
  } else if (previousStepVisibility === PREVIOUS_STEP_VISIBILITY.NONE) {
    return !isParentNode(currentNode, lastWizardStep)
  } else if (previousStepVisibility === PREVIOUS_STEP_VISIBILITY.WRITE) {
    return false
  } else {
    return true
  }
}

/**
 * Determine if `node` is any level ancestor of `parentNode`
 *
 * @param {Object} parentNode parent node
 * @param {Object} node       node to check
 *
 * @returns {Boolean} true if `node` is any ancestor of `parentNode`
 */
const isParentNode = (parentNode, node) => {
  let isParent = parentNode.sectionIndex !== -1 && parentNode.sectionIndex === node.sectionIndex

  if (parentNode.subSectionIndex !== -1) {
    isParent = isParent && parentNode.subSectionIndex === node.subSectionIndex
  }

  if (parentNode.questionIndex !== -1) {
    isParent = isParent && parentNode.questionIndex === node.questionIndex
  }

  if (parentNode.optionIndex !== -1) {
    isParent = isParent && parentNode.optionIndex === node.optionIndex
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
 *
 * @returns {Object} initialized template
 */
export const initWizard = (template, project, incompleteWizard) => {
  let wizardTemplate = _.cloneDeep(template)
  const isWizardMode = isWizardModeEnabled(wizardTemplate)
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
      nodeObject.__wizard.hidden = shouldNodeBeHidden(previousStepVisibility, node, lastWizardStep)

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
const getStepToShowByDir = (template, currentStep, dir) => {
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
 * Returns next sibling node inside template
 *
 * @param {Object} template template
 * @param {Object} node     current node
 *
 * @returns {Object} next sibling node
 */
const getNextSiblingNode = (template, node) => (
  getSiblingNodeByDir(template, node, NODE_DIR.NEXT)
)

/**
 * Returns previous sibling node inside template
 *
 * @param {Object} template template
 * @param {Object} node     current node
 *
 * @returns {Object} previous sibling node
 */
const getPrevSiblingNode = (template, node) => (
  getSiblingNodeByDir(template, node, NODE_DIR.PREV)
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

  return null
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

/**
 * Finalize/unfinalize node
 *
 * When we've done with node we want to finalize it as per previousStepVisibility value.
 * This method does it. It also can the reverse operation if `value` is defined as `false`
 *
 * @param {Object}  template template
 * @param {Object}  node     node
 * @param {Boolean} value
 *
 * @returns {Object} updated template
 */
const finalizeNode = (template, node, value = true) => {
  let updatedTemplate = template

  const previousStepVisibility = getPreviousStepVisibility(template)

  const updateRules = {
    [PREVIOUS_STEP_VISIBILITY.NONE]: {
      __wizard: {
        hidden: { $set: value }
      }
    },
  }

  const updateRule = updateRules[previousStepVisibility]

  if (updateRule) {
    updatedTemplate = updateNodeObject(updatedTemplate, node, updateRule)
  }

  return updatedTemplate
}

/**
 * Update template so the next step in desired direction is shown
 *
 * @param {Object} template    template
 * @param {Object} currentStep current step
 * @param {String} dir         direction
 *
 * @returns {Object} updated template
 */
export const showStepByDir = (template, currentStep, dir) => {
  let updatedTemplate = template
  let tempNode

  // if we are moving to the next step, we have to finalize previous one
  if (dir === NODE_DIR.NEXT) {
    // finalize step on it's level all parent levels of the step
    // as long as step is the last on the current level
    tempNode = currentStep
    do {
      updatedTemplate = finalizeNode(updatedTemplate, tempNode)

      // if step is the last node on the current level, we also finalize parent level node
      if (!getNextSiblingNode(updatedTemplate, tempNode, dir)) {
        tempNode = getParentNode(tempNode)
      } else {
        tempNode = null
      }
    } while (tempNode)

  // if we are moving to the previous step, we just have to hide current node
  } else {
    tempNode = currentStep

    do {
      updatedTemplate = updateNodeObject(updatedTemplate, tempNode, {
        __wizard: {
          hidden: { $set: true }
        }
      })

      // if step is the first on the current level, we also hide parent level step
      if (!getPrevSiblingNode(updatedTemplate, tempNode, dir)) {
        tempNode = getParentNode(tempNode)
      } else {
        tempNode = null
      }
    } while (tempNode)
  }

  const nextStep = getStepToShowByDir(updatedTemplate, currentStep, dir)

  if (!nextStep) {
    console.warn('showNextStep method is called when there is no next step, probably something is wrong.')
  }

  // make visible current node and all it's parents
  tempNode = nextStep
  do {
    updatedTemplate = updateNodeObject(updatedTemplate, tempNode, {
      __wizard: {
        hidden: { $set: false }
      }
    })
    tempNode = getParentNode(tempNode)
  } while (tempNode)

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
  const dir = getDirForNodes(currentStep, destinationStep)
  let tempNode = currentStep
  let tempDir = dir
  let updatedTemplate = template

  if (dir === NODE_DIR.SAME) {
    return updatedTemplate
  }

  while (tempDir === dir) {
    const nextStepData = showStepByDir(updatedTemplate, tempNode, dir)

    updatedTemplate = nextStepData.updatedTemplate
    tempNode = nextStepData.nextStep
    tempDir = getDirForNodes(tempNode, destinationStep)
  }

  return updatedTemplate
}

/**
 * Determines if node has dependant nodes
 *
 * @param {Object} template template
 * @param {Object} node     template
 *
 * @returns {Boolean} true if node has any dependant nodes
 */
export const isNodeHasDependencies = (template, node) => {
  const nodeObject = getNodeObject(template, node)

  return _.includes(_.get(template, '__wizard.dependantFields', []), nodeObject.fieldName)
}

/**
 * Find the closes step which contains provided node.
 *
 * @param {Object} template template
 * @param {Object} node     node
 *
 * @returns {Object} step
 */
export const findClosestStepByNode = (template, node) => {
  let tempNode = node
  let tempNodeObject = getNodeObject(template, tempNode)

  while (tempNode && !_.get(tempNodeObject, '__wizard.isStep')) {
    tempNode = getParentNode(tempNode)
    tempNodeObject = getNodeObject(template, tempNode)
  }

  return tempNode
}
