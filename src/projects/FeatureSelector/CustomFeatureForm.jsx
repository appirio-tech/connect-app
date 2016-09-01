import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'

require('./FeatureForm.scss')

class CustomFeatureForm extends Component {

  constructor(props) {
    super(props)
    this.toggleFeature = this.toggleFeature.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.featureData || {},
      isActive: !!nextProps.featureData
    })
  }

  toggleFeature() {
    const { removeFeature, addFeature, featureDesc, isEdittable } = this.props
    if (isEdittable) {
      if (this.state.isActive) {
        // remove feature
        removeFeature(featureDesc.id)
      } else {
        // add feature
        addFeature({
          id: featureDesc.id,
          categoryId: featureDesc.categoryId,
          notes: ''
        })
      }
    }
  }

  onSave(data) {
    const { featureData } = this.props
    this.props.updateFeature(_.merge({}, featureData, data))
  }

  render() {
    const { featureData, isEdittable } = this.props
    // const { isActive } = this.state
    return (
      <div className="feature-form">
        <div className="feature-title-row">
          <span className="title">{featureData.title || 'Define a new feature'}</span>
        </div>
        <div className="content">
          <Formsy.Form className="predefined-feature-form" disabled={!isEdittable} onValidSubmit={ this.onSave }>
            <TCFormFields.TextInput
              name="title"
              label="Featue name"
              validations="minLength:1" required
              validationError="Feature name is required"
              wrapperClass="row"
              placeholder="My awesome feature"
              value={featureData.title}
            />
            <TCFormFields.Textarea
              name="description"
              label="Featue description"
              wrapperClass="row"
              placeholder="Briefly describe the feature, including how it will be used, and provide examples that will help designers and developers understand it."
              value={featureData.description}
            />
            <button type="submit" className="tc-btn tc-btn-primary tc-btn-md" disabled={!isEdittable}>Save</button>
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
