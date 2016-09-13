import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Formsy, TCFormFields, SwitchButton } from 'appirio-tech-react-components'

require('./FeatureForm.scss')

class CustomFeatureForm extends Component {

  constructor(props) {
    super(props)
    this.toggleFeature = this.toggleFeature.bind(this)
    this.state = { }
    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const previousData = this.state.data || {}
    this.setState({
      data: nextProps.featureData || previousData,
      isActive: !!nextProps.featureData
    })
  }

  toggleFeature() {
    const { removeFeature, addFeature, featureData, isEdittable } = this.props
    if (isEdittable) {
      if (this.state.isActive) {
        // remove feature
        removeFeature(featureData.id)
      } else {
        // add feature
        addFeature(this.state.data)
      }
    }
  }

  onDelete(data) {
    this.props.removeFeature(data.id)
  }

  onSave(data) {
    const { featureData } = this.props
    this.props.addFeature(_.merge({
      id: data.title.toLowerCase().replace(' ', '_'),
      categoryId: 'custom',
      notes: ''
    }, featureData, data))
  }

  render() {
    const { isEdittable, onCancel } = this.props
    const { data, isActive } = this.state
    const submitButton = !isActive
      ? <button type="submit" className="tc-btn tc-btn-primary tc-btn-md" disabled={!isEdittable}>Save Feature</button>
      : <button type="submit" className="tc-btn tc-btn-default tc-btn-md" disabled={!isEdittable}>Delete Custom Feature</button>
    const formAction = isActive ? this.onDelete : this.onSave
    return (
      <div className="feature-form">
        <div className="feature-title-row">
          <span className="title">{ _.get(data, 'title', 'Define a new feature')}</span>
          <SwitchButton
            disabled={!isEdittable}
            onChange={ this.toggleFeature }
            name="featue-active"
            checked={isActive ? 'checked' : null }
          />
        </div>
        <div className="feature-form-content">
          <Formsy.Form className="custom-feature-form" disabled={!isEdittable} onValidSubmit={ formAction }>
            <TCFormFields.TextInput
              name="title"
              label="Feature name"
              validations="minLength:1" required
              validationError="Feature name is required"
              wrapperClass="row"
              // placeholder="My awesome feature"
              value={ _.get(data, 'title', '') }
            />
            <TCFormFields.Textarea
              name="description"
              label="Feature description"
              wrapperClass="feature-description"
              // placeholder="Briefly describe the feature, including how it will be used, and provide examples that will help designers and developers understand it."
              value={ _.get(data, 'description', '') }
            />
            <div className="feature-form-actions">
              { !isActive && <button type="button" className="tc-btn tc-btn-default tc-btn-md" onClick={ onCancel }>Cancel</button> }
              { submitButton }
            </div>
          </Formsy.Form>
        </div>
      </div>
    )
  }
}

CustomFeatureForm.PropTypes = {
  isActive: PropTypes.bool.isRequired,
  isEdittable: PropTypes.bool.isRequired,
  featureDesc: PropTypes.object.isRequired,
  featureData: PropTypes.object.isRequired,
  updateFeature: PropTypes.func.isRequired,
  removeFeature: PropTypes.func.isRequired,
  addFeature: PropTypes.func.isRequired
}

export default CustomFeatureForm
