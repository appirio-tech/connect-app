import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconUICheckBold from  '../../../../assets/icons/icon-ui-check-bold.svg'
import classNames from 'classnames'
import findIndex from 'lodash/findIndex'
require('./PickerFeatureList.scss')

class PickerFeatureList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { category, features, selectedFeatureId, activeFeatureList, onSelectFeature } = this.props
    const { id, label } = category

    let allFeatures = null
    if (id !== 'custom') {
      allFeatures = features
    } else {
      allFeatures = activeFeatureList.filter(f => f.categoryId === id)
    }
    const renderFeature = (feature, idx) => {
      const isActive = findIndex(activeFeatureList, f => f.id === feature.id) > -1 && !feature.disabled
      const featureClasses = classNames('feature-list-feature', {
        'active-feature' : feature.id === selectedFeatureId,
        'selected-feature' : isActive
      })
      const onClick = () => {
        if (feature.id !== selectedFeatureId)
          onSelectFeature(feature)
      }

      return (
        <li key={ idx } className={featureClasses}>
          <a onClick={ onClick } className="clean">
            <div className="flex space-between middle">
              <span className="feature-title">{ feature.title }</span>
              <span>{ isActive && <IconUICheckBold width={10} height={10} fill={'#FB7D22'} />}</span>
            </div>
          </a>
        </li>
      )
    }

    return (
      <div className="feature-picker-feature-list">
        <h3>{ label }</h3>
        <ul>
          { allFeatures.map(renderFeature) }
        </ul>
      </div>
    )
  }
}


PickerFeatureList.PropTypes = {
  activeFeatureList: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default PickerFeatureList
