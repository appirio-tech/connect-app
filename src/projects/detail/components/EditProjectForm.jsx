import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import FeaturePicker from '../../FeatureSelector/FeaturePicker'
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
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {
    this.setState({
      project: Object.assign({}, this.props.project),
      canSubmit: false,
      showFeaturesDialog: false
    })
  }

  componentWillReceiveProps() {
    this.setState({
      project: Object.assign({}, this.props.project),
      canSubmit: false
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

  saveFeatures(features) {
    const { project } = this.props
    console.log('saving features...')
    console.log(features)
    project.details.features = features
  }

  submit(model, resetForm, invalidateForm) {
    this.props.submitHandler(model, resetForm, invalidateForm)
  }

  render() {
    const { project, sections } = this.props
    const renderSection = (section, idx) => (
      <SpecSection key={idx} {...section} project={project} showFeaturesDialog={this.showFeaturesDialog}/>
    )

    return (
      <Formsy.Form onSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
        {sections.map(renderSection)}

        <div className="button-area">
          <button className="tc-btn tc-btn-primary tc-btn-md" type="submit" disabled={!this.state.canSubmit}>Save Changes</button>
        </div>

        <Modal
          isOpen={ this.state.showFeaturesDialog }
          className="feature-selection-dialog"
          onRequestClose={ this.hideFeaturesDialog }
        >
          <FeaturePicker onSave={ this.saveFeatures }/>
          <div onClick={ this.hideFeaturesDialog } className="feature-selection-dialog-close">
            <Icons.XMarkIcon />
          </div>
        </Modal>

      </Formsy.Form>
    )
  }
}

EditProjectForm.propTypes = {
  project: PropTypes.object.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  submitHandler: PropTypes.func.isRequired
}

export default EditProjectForm
