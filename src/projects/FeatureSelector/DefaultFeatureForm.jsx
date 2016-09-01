import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Formsy, TCFormFields, SwitchButton } from 'appirio-tech-react-components'

require('./FeatureForm.scss')

class DefaultFeatureForm extends Component {

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
    const { featureDesc, featureData, isEdittable } = this.props
    const { isActive } = this.state
    const _debouncedOnChange = _.debounce(this.onSave, 5000, { trailing: true, maxWait: 10000 })
    return (
      <div className="feature-form">
        <div className="feature-title-row flex space-between">
          <h3 className="title">{featureDesc.title}</h3>
          <SwitchButton
            disabled={!isEdittable}
            onChange={ this.toggleFeature }
            name="featue-active"
            checked={isActive ? 'checked' : null }
          />
        </div>
        <div className="feature-form-content">
          <p className="feature-description">{ featureDesc.description }</p>
          {
            isActive ?
              <Formsy.Form className="predefined-feature-form" disabled={!isEdittable} onChange={ _debouncedOnChange }>
                <TCFormFields.Textarea
                  name="notes"
                  label="Describe your objectives for creating this application"
                  wrapperClass="feature-notes"
                  placeholder="Notes..."
                  value={featureData.notes}
                />
              </Formsy.Form>
            : <noscript />
          }
        </div>
      </div>
    )
  }
}

DefaultFeatureForm.PropTypes = {
  isActive: PropTypes.bool.isRequired,
  isEdittable: PropTypes.bool.isRequired,
  featureDesc: PropTypes.object.isRequired,
  featureData: PropTypes.object.isRequired,
  updateFeature: PropTypes.func.isRequired,
  removeFeature: PropTypes.func.isRequired,
  addFeature: PropTypes.func.isRequired
}

export default DefaultFeatureForm
