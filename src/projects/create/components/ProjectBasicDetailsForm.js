import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import update from 'react-addons-update'
import { evaluate, getFieldNamesFromExpression } from '../../../helpers/dependentQuestionsHelper'
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

/**
 * Add auxillary `__wizard` property for sections, subSections and questions
 * if they have `wizard` property set to `true`.
 *
 * @param {Object} template raw template
 *
 * @returns {Object} template with initialized `__wizard` property
 */
const initWizard = (template) => {
  const wizardTemplate = _.cloneDeep(template)
  const currentWizardStep = {
    sectionIndex: -1,
    subSectionIndex: -1,
    questionIndex: -1,
  }

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

    // initialize sections wizard
    wizardTemplate.sections.forEach((section, sectionIndex) => {
      normalizeWizardProps(section)
      section.__wizard = {
        isStep: true,
        hidden: sectionIndex !== 0,
        step: {
          sectionIndex,
          subSectionIndex: -1,
          questionIndex: -1
        }
      }

      // init __wizard and conditional questions for all subSections
      section.subSections.forEach((subSection, subSectionIndex) => {
        if (!subSection.__wizard) {
          subSection.__wizard = {
            step: {
              sectionIndex,
              subSectionIndex,
              questionIndex: -1
            }
          }
        }

        // init __wizard and conditional questions for all questions
        subSection.questions && subSection.questions.forEach((question, questionIndex) => {
          if (!question.__wizard) {
            question.__wizard = {
              step: {
                sectionIndex,
                subSectionIndex,
                questionIndex
              }
            }
          }

          if (question.condition) {
            // for now use empty data to initially evaluate questions
            // possible we will need to update it and use flatten project object instead
            question.__wizard.hiddenByCondition = !evaluate(question.condition, {})
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

        section.subSections.forEach((subSection, subSectionIndex) => {
          normalizeWizardProps(subSection)
          subSection.__wizard.isStep = true
          subSection.__wizard.hidden = subSectionIndex !== 0

          // initialize questions wizard
          if ((_.get(subSection, 'wizard.enabled') || subSection.wizard === true) && subSection.questions) {
            // only if we are still in the first section and first subSections we can treat first question as current
            if (sectionIndex === 0 && subSection === 0) {
              currentWizardStep.questionIndex = 0
            }

            subSection.questions.forEach((question, questionIndex) => {
              subSection.__wizard.isStep = true
              question.__wizard.hidden = questionIndex !== 0
            })
          }
        })
      }
    })
  }

  return {
    template: wizardTemplate,
    currentWizardStep
  }
}

/**
 * Returns next sections, subSection or question which has to be shown on the next wizard step
 *
 * @param {Object} template template with initialized `__wizard` property
 *
 * @returns {{ nextSectionIndex: Number, nextSubSectionIndex: Number, nextQuestionIndex: Number }}
 */
const getNextStep = (template, currentStep) => {
  // get the next sibling of the current step if possible
  let nextStep = getNextSiblingStep(template, currentStep)

  // if there is no sibling
  // checking siblings of parent levels
  let tempStep = currentStep
  while (!nextStep && (tempStep = getParentStep(tempStep))) {
    const parentStepObject = getStepObject(template, tempStep)

    if (_.get(parentStepObject, '__wizard.isStep')) {
      nextStep = getNextSiblingStep(template, tempStep)
    }
  }

  // no matter where we get next step: between the sibling of the current step
  // or between siblings of the parent levels
  // try to find the most inner step inside the possible next step
  if (nextStep) {
    let tempStep = nextStep

    while (_.get(getStepObject(template, tempStep), 'wizard.enabled')) {
      const childrenSteps = getStepChildren(template, tempStep)

      if (childrenSteps[0]) {
        tempStep = childrenSteps[0]
      }
    }

    return tempStep
  }

  return null
}

const getNextStepToShow = (template, currentStep) => {
  let tempStep = currentStep
  let tempStepObject

  do {
    tempStep = getNextStep(template, tempStep)
    tempStepObject = tempStep && getStepObject(template, tempStep)
  } while (tempStepObject && _.get(tempStepObject, '__wizard.hiddenByCondition'))

  return tempStep
}

const getNextSiblingStep = (template, step) => {
  const level = getStepLevel(step)
  let nextSiblingStep = null

  switch(level) {
  case LEVEL.QUESTION:
    nextSiblingStep = {
      ...step,
      questionIndex: step.questionIndex + 1
    }
    break
  case LEVEL.SUB_SECTION:
    nextSiblingStep = {
      ...step,
      subSectionIndex: step.subSectionIndex + 1
    }
    break
  case LEVEL.SECTION:
    nextSiblingStep = {
      ...step,
      sectionIndex: step.sectionIndex + 1
    }
    break
  default: nextSiblingStep = null
  }

  if (nextSiblingStep && getStepObject(template, nextSiblingStep, level)) {
    return nextSiblingStep
  } else {
    return null
  }
}

/**
 * Checks if the wizard is finished
 *
 * @param {Object} template    template with initialized `__wizard` property
 * @param {Object} currentStep current step
 *
 * @returns {Boolean} true if wizard is finished
 */
const isWizardFinished = (template, currentStep) => {
  const nextStep = getNextStepToShow(template, currentStep)

  return !nextStep
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
 * @param {Object} projectFormData data to evaluate question conditions
 *
 * @returns {Object} updated template
 */
const updateQuestionsByConditions = (template, projectFormData) => {
  let updatedTemplate = template

  template.sections.forEach((section, sectionIndex) => {
    section.subSections.forEach((subSection, subSectionIndex) => {
      subSection.questions && subSection.questions.forEach((question, questionIndex) => {
        if (question.condition) {
          const hiddenByCondition = !evaluate(question.condition, projectFormData)

          // only update if the condition result has changed
          if (hiddenByCondition !== question.__wizard.hiddenByCondition) {
            updatedTemplate = updateQuestion(updatedTemplate, sectionIndex, subSectionIndex, questionIndex, {
              __wizard: {
                hiddenByCondition: { $set: hiddenByCondition }
              }
            })
          }
        }
      })
    })
  })

  return updatedTemplate
}

const finalizeStep = (template, step) => {
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
        readOnly: { $set: true }
      }
    },
    [PREVIOUS_STEP_VISIBILITY.NONE]: {
      __wizard: {
        hidden: { $set: true }
      }
    },
  }

  const updateRule = updateRules[previousStepVisibility]

  if (updateRule) {
    updatedTemplate = updateStepObject(updatedTemplate, step, updateRule)

    // if children of this step are in wizard, apply the same rule to them
    if (!_.get(stepObject, 'wizard.enabled')) {
      const stepChildren = getStepChildren(updatedTemplate, step)

      stepChildren.forEach((stepChild) => {
        updatedTemplate = updateStepObject(updatedTemplate, stepChild, updateRule)
      })
    }
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
    this.startEditReadOnly = this.startEditReadOnly.bind(this)
    this.stopEditReadOnly = this.stopEditReadOnly.bind(this)
    this.cancelEditReadOnly = this.cancelEditReadOnly.bind(this)
    this.confirmEditReadOnly = this.confirmEditReadOnly.bind(this)

    const { template, currentWizardStep } = initWizard(props.template, props.project)

    this.state = {
      template,
      isWizardFinished: isWizardFinished(template, currentWizardStep),
      projectFormData : {},
      showStartEditConfirmation: null,
      isEditingReadOnly: false,
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

    const updatedTemplate = updateStepObject(template, step, {
      __wizard: {
        readOnly: {
          $set: false
        },
        editReadOnly: {
          $set: true
        }
      }
    })

    this.setState({
      template: updatedTemplate,
      isEditingReadOnly: true,
    })
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
      isEditingReadOnly: false,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextState.canSubmit, this.state.canSubmit)
     && _.isEqual(nextState.template, this.state.template)
     && _.isEqual(nextState.isSaving, this.state.isSaving)
     && _.isEqual(nextState.isWizardFinished, this.state.isWizardFinished)
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
    if (nextProps.project.isDirty) return
    const updatedProject = Object.assign({}, nextProps.project)
    this.setState({
      project: updatedProject,
      isSaving: false,
      canSubmit: false
    })
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

    const updatedProjectFormData = update(this.state.projectFormData, { $merge: change })
    const updatedTemplate = updateQuestionsByConditions(this.state.template, updatedProjectFormData)

    this.setState({
      projectFormData: updatedProjectFormData,
      template: updatedTemplate,
    })

    this.props.onProjectChange(change)
  }

  showNextStep(evt) {
    // prevent default to avoid form being submitted
    evt.preventDefault()

    const { template } = this.state
    let updatedTemplate = template
    let tempStep

    // finalize step on it's level all parent levels of the step
    // as long as step is the last on the current level
    tempStep = this.currentWizardStep
    do {
      updatedTemplate = finalizeStep(updatedTemplate, tempStep)

      // if step is the last on the current level, we also finalize parent level step
      if (!getNextSiblingStep(updatedTemplate, tempStep)) {
        tempStep = getParentStep(tempStep)
      } else {
        tempStep = null
      }
    } while (tempStep)

    const nextStep = getNextStepToShow(updatedTemplate, this.currentWizardStep)

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

    this.currentWizardStep = nextStep

    this.setState({
      template: updatedTemplate,
      isWizardFinished: isWizardFinished(updatedTemplate, this.currentWizardStep)
    })
  }


  render() {
    const { isEditable, submitBtnText } = this.props
    const { project,
      canSubmit,
      template,
      isWizardFinished,
      showStartEditConfirmation,
      isEditingReadOnly,
    } = this.state

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
              // TODO we shoudl not update the props (section is coming from props)
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
            {!isWizardFinished ? (
              <button
                className="tc-btn tc-btn-primary tc-btn-md test"
                type="button"
                disabled={!canSubmit || isEditingReadOnly}
                onClick={this.showNextStep}
              >Next</button>
            ) : (
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                type="submit"
                disabled={(this.state.isSaving) || !canSubmit || isEditingReadOnly}
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
