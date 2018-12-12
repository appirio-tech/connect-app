import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import update from 'react-addons-update'
import { evaluate } from '../../../helpers/dependentQuestionsHelper'
import './ProjectBasicDetailsForm.scss'

import SpecSection from '../../detail/components/SpecSection'

/**
 * Add auxillary `__wizard` property for sections, subSections and questions
 * if they have `wizard` property set to `true`.
 *
 * @param {Object} template raw template
 * @param {Object} project raw template
 *
 * @returns {Object} template with initialized `__wizard` property
 */
const initWizard = (template) => {
  const wizardTemplate = _.cloneDeep(template)

  // only if template has `wizard: false` we will initialize wizards and conditional questions
  if (wizardTemplate.wizard) {
    // initialize sections wizard
    wizardTemplate.sections.forEach((section, index) => {
      section.__wizard = {
        hidden: index !== 0
      }

      // initialize subSections wizard
      if (section.wizard) {
        section.subSections.forEach((subSection, index) => {
          subSection.__wizard = {
            hidden: index !== 0
          }

          // initialize questions wizard
          if (subSection.wizard && subSection.questions) {
            subSection.questions.forEach((question, index) => {
              question.__wizard = {
                hidden: index !== 0
              }
            })
          }
        })
      }

      // init conditional questions for all subSections/questions
      section.subSections.forEach((subSection) => {
        subSection.questions && subSection.questions.forEach((question) => {
          if (question.condition) {
            if (!question.__wizard) {
              question.__wizard = {}
            }
            // for now use empty data to initially evaluate questions
            // possible we will need to update it and use flatten project object instead
            question.__wizard.hiddenByCondition = !evaluate(question.condition, {})
          }
        })
      })
    })
  }

  return wizardTemplate
}

/**
 * Returns next sections, subSection or question which has to be shown on the next wizard step
 *
 * @param {Object} template template with initialized `__wizard` property
 *
 * @returns {{ nextSectionIndex: Number, nextSubSectionIndex: Number, nextQuestionIndex: Number }}
 */
const getNextStep = (template) => {
  let nextSectionIndex = -1
  let nextSubSectionIndex = -1
  let nextQuestionIndex = -1

  _.forEach(template.sections, (section, sectionIndex) => {
    // stop searching if found hidden subSection or question on the previous iteration
    if (nextSectionIndex !== -1) {
      return false
    }

    // stop searching if found hidden section on this iteration
    if (_.get(section, '__wizard.hidden')) {
      nextSectionIndex = sectionIndex
      return false
    }

    // searching hidden subSection...
    _.forEach(section.subSections, (subSection, subSectionIndex) => {
      // stop searching if found hidden subSection
      if (_.get(subSection, '__wizard.hidden')) {
        nextSectionIndex = sectionIndex
        nextSubSectionIndex = subSectionIndex
        return false
      }

      // searching hidden question...
      nextQuestionIndex = _.findIndex(_.get(subSection, 'questions', []), (question) => (
        _.get(question, '__wizard.hidden')
      ))

      // stop searching if we found a hidden question
      if (nextQuestionIndex !== -1) {
        nextSectionIndex = sectionIndex
        nextSubSectionIndex = subSectionIndex
        return false
      }
    })
  })

  return {
    nextSectionIndex,
    nextSubSectionIndex,
    nextQuestionIndex,
  }
}

/**
 * Checks if the wizard is finished
 *
 * @param {Object} template template with initialized `__wizard` property
 *
 * @returns {Boolean} true if wizard is finished
 */
const isWizardFinished = (template) => {
  return getNextStep(template).nextSectionIndex === -1
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

class ProjectBasicDetailsForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.showNextStep = this.showNextStep.bind(this)

    const template = initWizard(props.template, props.project)

    this.state = {
      template,
      isWizardFinished: isWizardFinished(template),
      projectFormData : {},
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextState.canSubmit, this.state.canSubmit)
     && _.isEqual(nextState.template, this.state.template)
     && _.isEqual(nextState.isSaving, this.state.isSaving)
     && _.isEqual(nextState.isWizardFinished, this.state.isWizardFinished)
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
    let nextQuestion

    do {
      const {
        nextSectionIndex,
        nextSubSectionIndex,
        nextQuestionIndex,
      } = getNextStep(updatedTemplate)

      nextQuestion = nextQuestionIndex !== -1
        ? updatedTemplate.sections[nextSectionIndex].subSections[nextSubSectionIndex].questions[nextQuestionIndex]
        : null

      const updateRule = {
        __wizard: {
          hidden: { $set: false }
        }
      }

      if (nextQuestionIndex !== -1) {
        updatedTemplate = updateQuestion(updatedTemplate, nextSectionIndex, nextSubSectionIndex, nextQuestionIndex, updateRule)
      } else if (nextSubSectionIndex !== -1) {
        updatedTemplate = updateSubSection(updatedTemplate, nextSectionIndex, nextSubSectionIndex, updateRule)
      } else if (nextSectionIndex !== -1) {
        updatedTemplate = updateSection(updatedTemplate, nextSectionIndex, updateRule)
      }

    } while (nextQuestion && _.get(nextQuestion, '__wizard.hiddenByCondition'))

    this.setState({
      template: updatedTemplate,
      isWizardFinished: isWizardFinished(updatedTemplate)
    })
  }

  render() {
    const { isEditable, submitBtnText } = this.props
    const { project, canSubmit, template, isWizardFinished } = this.state

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
            />
          </div>
        </div>
      )
    }

    return (
      <div>
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
