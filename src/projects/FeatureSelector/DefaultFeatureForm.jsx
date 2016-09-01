import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'

require('./FeatureForm.scss')

class DefaultFeatureForm extends Component {

  constructor(props) {
    super(props)
    this.toggleFeature = this.toggleFeature.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
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

  onChange(data) {
    const { featureData } = this.props
    this.props.updateFeature(_.merge({}, featureData, data))
  }

  render() {
    const { featureDesc, featureData, isEdittable } = this.props
    const { isActive } = this.state
    const _debouncedOnChange = _.debounce(this.onChange, 2000, { trailing: true, maxWait: 10000 })
    return (
      <div className="feature-form">
        <div className="feature-title-row">
          <span className="title">{featureDesc.title}</span>
            {/*
            <SwitchButton
              disabled={!isEdittable}
              onChange={ this.toggleFeature }
              name="featue-active"
              {...checkedProps}
            />
            */}
            <Formsy.Form >
            <TCFormFields.Checkbox
              name="isActive"
              value={isActive}
              onChange={this.toggleFeature}
            />
            </Formsy.Form>

        </div>
        <div className="content">
          <p>{ featureDesc.description }</p>
          {
            isActive ?
              <Formsy.Form className="predefined-feature-form" disabled={!isEdittable} onChange={ _debouncedOnChange }>
                <TCFormFields.Textarea
                  name="notes"
                  label="Describe your objectives for creating this application"
                  wrapperClass="row"
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
