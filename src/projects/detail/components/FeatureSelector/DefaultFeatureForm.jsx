import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Formsy, TCFormFields, SwitchButton } from 'appirio-tech-react-components'

require('./FeatureForm.scss')

class DefaultFeatureForm extends Component {

  constructor(props) {
    super(props)
    this.toggleFeature = this.toggleFeature.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return !(_.isEqual(nextProps.featureData, this.props.featureData) &&
      _.isEqual(nextProps.featureDesc, this.props.featureDesc))
  }

  componentWillMount() {
    this.setState({
      data: this.props.featureData || {},
      isActive: !!this.props.featureData
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.featureData || {},
      isActive: !!nextProps.featureData
    })
  }

  toggleFeature() {
    const { toggleFeature, addFeature, featureDesc, isEdittable } = this.props
    if (isEdittable) {
      if (this.state.isActive) {
        // remove feature
        toggleFeature(featureDesc.id, true)
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

  onChange(data) {
    const { featureData } = this.props
    // trim the notes (as of now only notes field is auto updated)
    data.notes = data.notes.trim()
    this.props.updateFeature(_.merge({}, featureData, data))
  }

  render() {
    const { featureDesc, featureData, isEdittable } = this.props
    const { isActive } = this.state
    // const _debouncedOnChange = _.debounce(this.onChange, 2000, { trailing: true, maxWait: 10000 })
    return (
      <div className="feature-form">
        <div className="feature-title-row flex space-between">
          <h3 className="title">{featureDesc.title}</h3>
          <SwitchButton
            disabled={!isEdittable}
            onChange={ this.toggleFeature }
            name="featue-active"
            checked={isActive}
            label="Enable feature"
          />
        </div>
        <div className="feature-form-content">
          <p className="feature-description">{ featureDesc.description }</p>
          {
            isActive ?
              <Formsy.Form className="predefined-feature-form" disabled={!isEdittable} onChange={ this.onChange }>
                <TCFormFields.Textarea
                  name="notes"
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
