import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import {
  initWizard,
  getNextStepToShow,
  getPrevStepToShow,
  isStepHasDependencies,
  findRealStep,
  rewindToStep,
  updateStepsByConditions,
  showStepByDir,
  pushStepDataSnapshot,
  popStepDataSnapshot,
  removeValuesOfHiddenSteps,
  STEP_DIR,
  PREVIOUS_STEP_VISIBILITY,
} from '../../../helpers/wizardHelper'
import { LS_INCOMPLETE_WIZARD } from '../../../config/constants'
import Modal from 'react-modal'
import './ProjectBasicDetailsForm.scss'

import SpecSection from '../../detail/components/SpecSection'

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
    this.declineEditReadOnly = this.declineEditReadOnly.bind(this)
    this.cancelEditReadOnly = this.cancelEditReadOnly.bind(this)
    this.confirmEditReadOnly = this.confirmEditReadOnly.bind(this)
    this.updateEditReadOnly = this.updateEditReadOnly.bind(this)

    const incompleteWizardStr = window.localStorage.getItem(LS_INCOMPLETE_WIZARD)
    let incompleteWizard = {}
    if (incompleteWizardStr) {
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
      previousStepVisibility,
      hasDependantFields,
    } = initWizard(props.template, props.project, incompleteWizard)

    this.state = {
      template,
      nextWizardStep: getNextStepToShow(template, currentWizardStep),
      showStartEditConfirmation: null,
      prevWizardStep,
      isWizardMode,
      previousStepVisibility,
      hasDependantFields,
      editingReadonlyStep: null
    }

    // we don't use for rendering, only for internal needs, so we don't need it in state
    this.currentWizardStep = currentWizardStep

    // we will keep there form values before starting editing read-only values
    // and we will use this data to restore previous values if user press Cancel
    this.dataSnapshots = []
  }

  startEditReadOnly(step) {
    const { template } = this.state

    if (isStepHasDependencies(template, step)) {
      this.setState({
        showStartEditConfirmation: step,
      })
    } else {
      this._startEditReadOnly(step)
    }
  }

  declineEditReadOnly() {
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

    step = findRealStep(template, step)
    pushStepDataSnapshot(this.dataSnapshots, step, template, this.refs.form.getCurrentValues())
    updatedTemplate = rewindToStep(updatedTemplate, this.currentWizardStep, step)

    this.setState({
      template: updatedTemplate,
      editingReadonlyStep: step
    })
  }

  cancelEditReadOnly() {
    const { template, editingReadonlyStep } = this.state
    let updatedTemplate = template

    const savedSnapshot = popStepDataSnapshot(this.dataSnapshots, editingReadonlyStep)
    updatedTemplate = rewindToStep(updatedTemplate, editingReadonlyStep, this.currentWizardStep)

    this.setState({
      // first we show back form fields as it were before
      template: updatedTemplate,
      editingReadonlyStep: null
    }, () => {
      // only after we showed all the fields back we can restore their values
      this.refs.form.inputs.forEach(component => {
        const name = component.props.name

        if (!_.isUndefined(savedSnapshot[name])) {
          component.setValue(savedSnapshot[name])
        }
      })
    })
  }

  updateEditReadOnly(evt) {
    // prevent default to avoid form being submitted
    evt && evt.preventDefault()

    const { editingReadonlyStep } = this.state

    // removed saved snapshot
    popStepDataSnapshot(this.dataSnapshots, editingReadonlyStep)
    this.currentWizardStep = editingReadonlyStep

    this.showNextStep()
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
    if (this.state.hasDependantFields && !_.isEqual(nextProps.dirtyProject, this.props.dirtyProject)) {
      const {
        updatedTemplate,
        hidedSomeSteps,
        updatedSomeSteps,
      } = updateStepsByConditions(this.state.template, nextProps.dirtyProject)

      if (updatedSomeSteps) {
        this.setState({
          template: updatedTemplate,
          project: hidedSomeSteps ? nextProps.dirtyProject : this.state.project,
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

  submit(model) {
    this.setState({isSaving: true })
    const modelWithoutHiddenValues = removeValuesOfHiddenSteps(this.state.template, model)
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

    const { template } = this.state
    const { updatedTemplate, nextStep } = showStepByDir(template, this.currentWizardStep, dir)

    this.setState({
      template: updatedTemplate,
      nextWizardStep: getNextStepToShow(updatedTemplate, nextStep),
      prevWizardStep: dir === STEP_DIR.NEXT ? this.currentWizardStep : getPrevStepToShow(updatedTemplate, nextStep),
      project: this.props.dirtyProject,
      editingReadonlyStep: null
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
    const { isEditable, submitBtnText, dirtyProject, productTemplates } = this.props
    const {
      project,
      canSubmit,
      template,
      nextWizardStep,
      prevWizardStep,
      showStartEditConfirmation,
      isWizardMode,
      previousStepVisibility,
      editingReadonlyStep,
    } = this.state

    const renderSection = (section, idx) => {
      return (
        <div key={idx} className="ProjectBasicDetailsForm">
          <div className="sections">
            <SpecSection
              {...section}
              project={project}
              dirtyProject={dirtyProject}
              productTemplates={productTemplates}
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
              startEditReadOnly={this.startEditReadOnly}
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
          onRequestClose={this.declineEditReadOnly}
          contentLabel=""
        >
          <div className="modal-title">
            Confirmation
          </div>

          <div className="modal-body">
            You are about to change the response to question which may result in loss of data, do you want to continue?
          </div>

          <div className="button-area flex center action-area">
            <button className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel" onClick={this.declineEditReadOnly}>Cancel</button>
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
            {isWizardMode && previousStepVisibility === PREVIOUS_STEP_VISIBILITY.NONE && (
              <button
                className="tc-btn tc-btn-default tc-btn-md"
                type="button"
                onClick={this.showPrevStep}
                disabled={!prevWizardStep}
              >Back</button>
            )}
            {editingReadonlyStep && (
              <button
                className="tc-btn tc-btn-default tc-btn-md"
                type="button"
                onClick={this.cancelEditReadOnly}
              >Cancel</button>
            )}
            {(nextWizardStep || editingReadonlyStep) ? (
              <button
                className="tc-btn tc-btn-primary tc-btn-md"
                type="button"
                disabled={!canSubmit}
                onClick={editingReadonlyStep ? this.updateEditReadOnly : this.showNextStep}
              >{editingReadonlyStep ? 'Update' : 'Next'}</button>
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
  productTemplates: PropTypes.array.isRequired,
  submitHandler: PropTypes.func.isRequired
}

export default ProjectBasicDetailsForm
