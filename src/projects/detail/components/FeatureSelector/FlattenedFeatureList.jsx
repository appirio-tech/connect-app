import React from 'react'
import PropTypes from 'prop-types'
import FeaturePicker from './FeaturePicker'
import IconCustomFeatures from '../../../../assets/icons/custom-features.svg'
require('./FlattenedFeatureList.scss')


const allFeaturesMap = FeaturePicker.ALL_FEATURES_MAP

const FlattenedFeatureList = ({ addedFeatures }) => {
  let childrenDom = null

  if (addedFeatures) {
    childrenDom = []
    addedFeatures.map((f, idx) => {
      if (f.disabled) return
      const feature = f.categoryId === 'custom' ? f : allFeaturesMap[f.id]
      if (feature.categoryId === 'custom') {
        feature.icon = IconCustomFeatures
      }
      childrenDom.push(
        <div className="flattened-feature-list-item" key={idx}>
          {feature.icon && <div className="icon-col">{ <img src={feature.icon} /> }</div>}
          <div className="content-col">
            <h4>{ feature.title }</h4>
            <p>{ feature.categoryId === 'custom' ? feature.notes : feature.description }</p>
          </div>
        </div>
      )
    })
  }
  return (
    <div className="flattened-feature-list">
      { childrenDom }
    </div>
  )
}

FlattenedFeatureList.propTypes = {
  addedFeatures: PropTypes.array
}

export default FlattenedFeatureList
