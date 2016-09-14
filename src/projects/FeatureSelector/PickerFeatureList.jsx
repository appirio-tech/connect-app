import React, { Component, PropTypes } from 'react'
import { Icons } from 'appirio-tech-react-components'
import classNames from 'classnames'
import _ from 'lodash'
require('./PickerFeatureList.scss')

class PickerFeatureList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { category, features, selectedFeatureId, activeFeatureList, onSelectFeature } = this.props
    const { id, icon, label } = category

    let allFeatures = null
    if (id !== 'custom') {
      allFeatures = features
    } else {
      allFeatures = _.filter(activeFeatureList, f => f.categoryId === id)
    }
    const renderFeature = (feature, idx) => {
      const isActive = _.findIndex(activeFeatureList, f => f.id === feature.id) > -1
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
              <span>{ isActive &&  <Icons.IconUICheckBold width={10} height={10} fill={'#FB7D22'} />}</span>
            </div>
          </a>
        </li>
      )
    }
    return (
      <div className="feature-picker-feature-list">
        <header className="flex middle">
          <img src={ icon } />
          <h6>{ label }</h6>
        </header>
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
