import React, {PropTypes} from 'react'
import cn from 'classnames'
import FeaturePicker from './FeaturePicker'
require('./FlattenedFeatureList.scss')

const FlattenedFeatureList = ({ addedFeatures }) => {
  let childrenDom = null
  const features = FeaturePicker.AVAILABLE_FEATURES
  if (addedFeatures) {
    childrenDom = []
    features.map((feature, idx) => {
      const isAdded = addedFeatures.filter((f) => { return f.title === feature.title }).length > 0
      if (isAdded) {
        childrenDom.push(
          <div className="flattened-feature-list-item" key={idx}>
            {feature.icon && <div className="icon-col">{ <img src={feature.icon} /> }</div>}
            <div className="content-col">
              <h4>{ feature.title }</h4>
              <p className={cn({bigger: !feature.icon})}>{ feature.description }</p>
            </div>
          </div>
        )
      }
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