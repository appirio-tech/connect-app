import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import {
  initWizard,
  getNextStepToShow,
  getPrevStepToShow,
  updateNodesByConditions,
  getStepToShowByDir,
  removeValuesOfHiddenNodes,
  getVisibilityForRendering,
  NODE_DIR,
  STEP_VISIBILITY,
  geStepState,
} from '../../../helpers/wizardHelper'
import {
  LS_INCOMPLETE_WIZARD,
  LS_INCOMPLETE_PROJECT,
} from '../../../config/constants'
import './ProjectBasicDetailsForm.scss'

import SpecSection from '../../detail/components/SpecSection'
import StaticSection from './StaticSection'

class ProjectBasicDetailsForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.showNextStep = this.showNextStep.bind(this)
    this.showPrevStep = this.showPrevStep.bind(this)

    const incompleteProjectStr = window.localStorage.getItem(LS_INCOMPLETE_PROJECT)
    const incompleteWizardStr = window.localStorage.getItem(LS_INCOMPLETE_WIZARD)
    let incompleteWizard = {}
    // only restore wizard state if there is incomplete project
    // sometimes it happens that we have incomplete wizard but don't have incomplete project
    // we should ignore incomplete wizard in such cases
    if (incompleteProjectStr && incompleteWizardStr) {
      try {
        incompleteWizard = JSON.parse(incompleteWizardStr)
      } catch (e) {
        console.error('Cannot parse incomplete Wizard state.')
      }
    }
    const {
      template,
      currentWizardStep,
      prevWizardStep,
      isWizardMode,
      hasDependantFields,
    } = initWizard(props.template, props.project, incompleteWizard)

    this.state = {
      template,
      nextWizardStep: getNextStepToShow(template, currentWizardStep),
      prevWizardStep,
      isWizardMode,
      hasDependantFields,
      currentWizardStep
    }

    this.props.onStepChange(currentWizardStep)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextProps.dirty, this.props.dirty)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextState.canSubmit, this.state.canSubmit)
     && _.isEqual(nextState.template, this.state.template)
     && _.isEqual(nextState.currentWizardStep, this.state.currentWizardStep)
     && _.isEqual(nextState.isSaving, this.state.isSaving)
     && _.isEqual(nextState.nextWizardStep, this.state.nextWizardStep)
     && _.isEqual(nextState.prevWizardStep, this.state.prevWizardStep)
    )
  }

  componentWillMount() {
    this.setState({
      project: Object.assign({}, this.props.project),
      canSubmit: false
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.hasDependantFields && !_.isEqual(nextProps.dirtyProject, this.props.dirtyProject)) {
      const {
        updatedTemplate,
        hidedSomeNodes,
        updatedSomeNodes,
      } = updateNodesByConditions(this.state.template, nextProps.dirtyProject)

      if (updatedSomeNodes) {
        this.setState({
          template: updatedTemplate,
          project: hidedSomeNodes ? nextProps.dirtyProject : this.state.project,
        })
      }
    }
  }

  enableButton() {
    this.setState( { canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  submit(/* model */) {
    // we cannot use `model` provided by Formzy because in the `previousStepVisibility==none` mode
    // some parts of the form are hidden, so Formzy thinks we don't have them
    // instead we use this.props.dirtyProject which contains the current project data
    this.setState({isSaving: true })
    const modelWithoutHiddenValues = removeValuesOfHiddenNodes(this.state.template, this.props.dirtyProject)
    this.props.submitHandler(modelWithoutHiddenValues)
  }

  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   */
  handleChange(change) {
    this.props.onProjectChange(change)
  }

  showStepByDir(evt, dir) {
    // prevent default to avoid form being submitted
    evt && evt.preventDefault()

    const { currentWizardStep, template } = this.state
    const nextStep = getStepToShowByDir(template, currentWizardStep, dir)

    this.setState({
      nextWizardStep: getNextStepToShow(template, nextStep),
      prevWizardStep: dir === NODE_DIR.NEXT ? currentWizardStep : getPrevStepToShow(template, nextStep),
      project: this.props.dirtyProject,
      currentWizardStep: nextStep
    })

    this.props.onStepChange(nextStep)

    window.localStorage.setItem(LS_INCOMPLETE_WIZARD, JSON.stringify({
      currentWizardStep: nextStep
    }))
  }

  showNextStep(evt) {
    this.showStepByDir(evt, NODE_DIR.NEXT)
  }

  showPrevStep(evt) {
    this.showStepByDir(evt, NODE_DIR.PREV)
  }

  render() {
    const { isEditable, submitBtnText, dirtyProject, productTemplates, productCategories } = this.props
    const {
      project,
      canSubmit,
      template,
      nextWizardStep,
      prevWizardStep,
      isWizardMode,
      currentWizardStep,
    } = this.state

    const currentSection = currentWizardStep && template.sections[currentWizardStep.sectionIndex]
    const nextButtonText = _.get(currentSection, 'nextButtonText', 'Next')
    const submitButtonText = _.get(currentSection, 'nextButtonText', submitBtnText)

    const renderSection = (section, idx) => {
      return (
        <div
          key={section.id || `section-${idx}`}
          className={cn(
            'ProjectBasicDetailsForm', {
              [`section-theme-${section.theme}`]: !!section.theme,
              [`section-state-${section.stepState}`]: !!section.stepState,
              [`section-visibility-${section.visibilityForRendering}`]: !!section.visibilityForRendering
            }
          )}
        >
          <div className="sections">
            <SpecSection
              {...section}
              project={project}
              template={template}
              currentWizardStep={currentWizardStep}
              dirtyProject={dirtyProject}
              productTemplates={productTemplates}
              productCategories={productCategories}
              // when creating a project we can treat project as dirty,
              // as we didn't have project at all and now creating something
              isProjectDirty
              sectionNumber={idx + 1}
              showFeaturesDialog={ () => {} }//dummy
              resetFeatures={ () => {} }//dummy
              // TODO we should not update the props (section is coming from props)
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
          {template.sections.map(section => ({
            ...section,
            visibilityForRendering: getVisibilityForRendering(template, section, currentWizardStep),
            stepState: geStepState(section, currentWizardStep)
          })).filter(section => (
            // hide if we are in a wizard mode and section is hidden for now
            section.visibilityForRendering !== STEP_VISIBILITY.NONE &&
            // hide if section is hidden by condition
            (!_.get(section, '__wizard.hiddenByCondition'))
          )).map(renderSection)}

          <div className="section-footer section-footer-spec">
            {isWizardMode && (
              <button
                className="tc-btn tc-btn-default tc-btn-md"
                type="button"
                onClick={this.showPrevStep}
                disabled={!prevWizardStep}
              >Back</button>
            )}
            {nextWizardStep ? (
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                type="button"
                disabled={!canSubmit}
                onClick={this.showNextStep}
              >{nextButtonText}</button>
            ) : (
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                type="submit"
                disabled={(this.state.isSaving) || !canSubmit}
              >{submitButtonText}</button>
            )}
          </div>

          {!!_.get(currentSection, 'footer') && (
            <StaticSection content={currentSection.footer.content} currentProjectData={dirtyProject} />
          )}
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
  productTemplates: PropTypes.array.isRequired,
  submitHandler: PropTypes.func.isRequired,
  onStepChange: PropTypes.func.isRequired,
  productCategories: PropTypes.array.isRequired,
}

export default ProjectBasicDetailsForm
