import classNames from 'classnames'
import React, { Component} from 'react'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy

require('./FeatureForm.scss')

class FeatureForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      notes: '',
      showCutsomFeatureForm : props.showCutsomFeatureForm
    }
    this.addCustomFeature = this.addCustomFeature.bind(this)
    this.hideCustomFeatures = this.hideCustomFeatures.bind(this)
    this.applyFeature = this.applyFeature.bind(this)
    this.removeFeature = this.removeFeature.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: '',
      description: '',
      notes: '',
      showCutsomFeatureForm : nextProps.showCutsomFeatureForm
    })
  }

  hideCustomFeatures() {
    this.setState({
      showCutsomFeatureForm : false
    })
  }

  applyFeature(submittedFeature) {
    this.props.onAddFeature(submittedFeature)
  }

  removeFeature() {
    this.props.onRemoveFeature()
  }

  addCustomFeature(model) {
    this.props.onAddCustomFeature(model)
  }

  renderFeatureForm() {
    const { showCutsomFeatureForm } = this.state
    const { readOnly, feature, addedFeatures } = this.props
    let featureDom = null
    if (!showCutsomFeatureForm && !feature) {
      featureDom = (
        <div className="default active">
          <h3>Select and define features for your app</h3>
          <p>Select from the most popular features, listed on the left, or define your own custom features.</p>
        </div>
      )
    }
    const selected = addedFeatures.filter((f) => { return feature && f.title === feature.title}).length > 0
    const submitAction = !selected ? this.applyFeature : this.removeFeature
    const buttonText = !selected ? 'Add this feature' : 'Remove feature'
    if (!showCutsomFeatureForm && feature) {
      featureDom = (
        <div className="description active">
          <h3>{ feature.title }</h3>
          <p>{ feature.description }</p>
          <TCFormFields.Textarea
            name="notes"
            label="Notes"
            disabled={ readOnly }
            wrapperClass="row"
            placeholder="Notes..."
            // value={ feature.notes || this.state.notes }
          />
          <div className="button-area">
            <button type="submit" className="tc-btn tc-btn-primary tc-btn-md" disabled={ readOnly }>{ buttonText }</button>
          </div>
        </div>
      )
    }
    return (
      <Formsy.Form className="predefined-feature-form" onValidSubmit={ submitAction }>
        { featureDom }
      </Formsy.Form>
    )
  }

  renderCustomFeatureForm() {
    const { showCutsomFeatureForm } = this.state
    const { readOnly } = this.props
    const custFeatureClasses = classNames('new-feature', {
      active: showCutsomFeatureForm
    })
    return (
      <div className={ custFeatureClasses }>
        <Formsy.Form className="custom-feature-form" onValidSubmit={this.addCustomFeature}>
          <h3>Define a new feature</h3>
          <TCFormFields.TextInput
            name="title"
            type="text"
            label="Feature name"
            validations="minLength:1" required
            //TODO add unique validation
            validationError="feature name is required"
            placeholder="enter feature name"
            disabled={ readOnly }
            wrapperClass="row"
          />
          <TCFormFields.Textarea
            name="description"
            label="Feature Description"
            disabled={ readOnly }
            wrapperClass="row"
            placeholder="Briefly describe the feature, including how it will be used, and provide examples that will help designers and developers understand it."
          />

          <div className="button-area">
            <button className="tc-btn tc-btn-primary tc-btn-md" type="submit" disabled={ readOnly }>Add</button>
            <button type="button" className="tc-btn tc-btn-secondary tc-btn-md cancel" onClick={ this.hideCustomFeatures }>Cancel</button>
          </div>
        </Formsy.Form>
      </div>
    )
  }

  render() {
    return (
      <div className="feature-form">
        { this.renderFeatureForm() }
        { this.renderCustomFeatureForm() }
      </div>
    )
  }
}

export default FeatureForm
