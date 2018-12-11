import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import update from 'react-addons-update'
const Formsy = FormsyForm.Formsy
import './ProjectBasicDetailsForm.scss'

import SpecSection from '../../detail/components/SpecSection'

/**
 * Add auxillary `__wizard` property for sections, subSections and questions
 * which has `wizard` property set to `true`.
 *
 * @param {Object} template raw template
 *
 * @returns {Object} template with initialized `__wizard` property
 */
const initWizard = (template) => {
  const wizardTemplate = _.cloneDeep(template)

  // initialize sections wizard
  if (wizardTemplate.wizard) {
    wizardTemplate.sections.forEach((section, index) => {
      section.__wizard = {
        hidden: index !== 0
      }
    })
  }

  wizardTemplate.sections.forEach(section => {
    // initialize subSections wizard
    if (section.wizard) {
      section.subSections.forEach((subSection, index) => {
        subSection.__wizard = {
          hidden: index !== 0
        }
      })
    }

    section.subSections.forEach((subSection) => {
      // initialize questions wizard
      if (subSection.wizard) {
        subSection.questions.forEach((question, index) => {
          question.__wizard = {
            hidden: index !== 0
          }
        })
      }
    })
  })

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

class ProjectBasicDetailsForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.showNextStep = this.showNextStep.bind(this)

    const template = initWizard(props.template)

    this.state = {
      template,
      isWizardFinished: isWizardFinished(template)
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
    this.props.onProjectChange(change)
  }

  showNextStep(evt) {
    // prevent default to avoid form being submitted
    evt.preventDefault()

    const { template } = this.state

    const {
      nextSectionIndex,
      nextSubSectionIndex,
      nextQuestionIndex,
    } = getNextStep(template)

    if (nextSectionIndex !== -1) {
      const nextSection = this.state.template.sections[nextSectionIndex]
      const nextSubSection = nextSection.subSections[nextSubSectionIndex]
      const nextQuestion = nextQuestionIndex !== -1 ? nextSubSection.questions[nextQuestionIndex] : null

      let updatedSubSection

      // if we have next question to show, then UN-mark it as hidden
      if (nextQuestion) {
        const updatedQuestion = update(nextQuestion, {
          __wizard: {
            $set: {
              ...nextQuestion.__wizard,
              hidden: false
            }
          }
        })

        updatedSubSection = update(nextSubSection, {
          questions: {
            $splice: [[nextQuestionIndex, 1, updatedQuestion]]
          }
        })

      // otherwise UN-mark subSection as hidden
      } else {
        updatedSubSection = update(nextSubSection, {
          __wizard: {
            $set: {
              ...nextSubSection.__wizard,
              hidden: false
            }
          }
        })
      }

      const updatedSection = update(nextSection, {
        subSections: {
          $splice: [[nextSubSectionIndex, 1, updatedSubSection]]
        }
      })

      const updatedTemplate = update(this.state.template, {
        sections: {
          $splice: [[nextSectionIndex, 1, updatedSection]]
        }
      })

      this.setState({
        template: updatedTemplate,
        isWizardFinished: isWizardFinished(updatedTemplate)
      })
    } else {
      // in theory this should never happen as we shouldn't show `Next` button
      // if there are no further steps to show
      this.setState({
        isWizardFinished: true
      })
    }
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
          {template.sections.map(renderSection)}
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
