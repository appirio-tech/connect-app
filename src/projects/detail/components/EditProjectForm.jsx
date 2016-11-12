import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import _ from 'lodash'
import update from 'react-addons-update'
import FeaturePicker from './FeatureSelector/FeaturePicker'
import { Formsy, Icons } from 'appirio-tech-react-components'

import SpecSection from './SpecSection'

class EditProjectForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.showFeaturesDialog = this.showFeaturesDialog.bind(this)
    this.hideFeaturesDialog = this.hideFeaturesDialog.bind(this)
    this.saveFeatures = this.saveFeatures.bind(this)
    this.onFeaturesSaveAttachedClick = this.onFeaturesSaveAttachedClick.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {
    this.setState({
      isProjectDirty: false,
      isFeaturesDirty: false,
      project: Object.assign({}, this.props.project),
      canSubmit: false,
      showFeaturesDialog: false
    })
  }

  componentWillReceiveProps(nextProps) {
    let updatedProject = Object.assign({}, nextProps.project)
    if (this.state.isFeaturesDirty && !this.state.isSaving) {
      updatedProject = update(updatedProject, {details: { appDefinition: { features: { $set: this.state.project.details.appDefinition.features } } } })
    }
    this.setState({
      project: updatedProject,
      canSubmit: this.state.isFeaturesDirty,
      isSaving: false
    })
  }


  enableButton() {
    this.setState( { canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  showFeaturesDialog() {
    this.setState({ showFeaturesDialog : true})
  }

  hideFeaturesDialog() {
    this.setState({ showFeaturesDialog: false })
  }

  onFeaturesSaveAttachedClick() {
    this.saveFeatures([], true)
  }

  saveFeatures(features, featureSeeAttached=false) {
    if (!this.state.project.details.appDefinition) {
      this.state.project.details.appDefinition = { features: {} }
    }
    const featureObj = {
      value: features,
      seeAttached: featureSeeAttached
    }
    this.setState(update(this.state, {
      isFeaturesDirty: { $set: true },
      project: { details: { appDefinition: { features: { $set: featureObj } } } },
      canSubmit: { $set: true }
    }))
    // const details = update(this.state.project.details, { appDefinition: { features: { $set: obj }}})
    // this.props.submitHandler({ details })
  }

  submit(model) {
    if (this.state.isFeaturesDirty) {
      model.details.appDefinition.features = this.state.project.details.appDefinition.features
    }
    this.setState({isSaving: true })
    this.props.submitHandler(model)
  }


  render() {
    const { isEdittable, sections } = this.props
    const { project } = this.state
    const renderSection = (section, idx) => (
      <div key={idx}>
        <SpecSection
          {...section}
          project={project}
          resetFeatures={this.onFeaturesSaveAttachedClick}
          showFeaturesDialog={this.showFeaturesDialog}
        />
        <div className="section-footer section-footer-spec">
          <button className="tc-btn tc-btn-primary tc-btn-md"
            type="submit" disabled={!this.state.canSubmit || this.state.isSaving }
          >Save Changes</button>
        </div>
      </div>
    )

    return (
      <div>
        <Formsy.Form
          ref="form"
          disabled={!isEdittable}
          onInvalid={this.disableButton}
          onValid={this.enableButton}
          onValidSubmit={this.submit}
        >
          {sections.map(renderSection)}
        </Formsy.Form>
        <Modal
          isOpen={ this.state.showFeaturesDialog }
          className="feature-selection-dialog"
          overlayClassName="feature-selection-dialog-overlay"
          onRequestClose={ this.hideFeaturesDialog }
        >
          <FeaturePicker
            features={ _.get(project, 'details.appDefinition.features.value', []) }
            isEdittable={isEdittable} onSave={ this.saveFeatures }
          />
          <div onClick={ this.hideFeaturesDialog } className="feature-selection-dialog-close">
            <Icons.XMarkIcon />
          </div>
        </Modal>
      </div>
    )
  }
}

EditProjectForm.propTypes = {
  project: PropTypes.object.isRequired,
  saving: PropTypes.bool.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEdittable: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired
}

export default EditProjectForm
