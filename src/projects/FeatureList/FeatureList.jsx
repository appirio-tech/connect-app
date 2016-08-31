import React, {PropTypes} from 'react'
import cn from 'classnames'
import FeaturePicker from '../FeatureSelector/FeaturePicker'
require('./FeatureList.scss')

const FeatureList = ({addedFeatures, children}) => {
  let childrenDom = children
  const features = FeaturePicker.AVAILABLE_FEATURES
  if (addedFeatures) {
    childrenDom = []
    features.map((feature, idx) => {
      const isAdded = addedFeatures.filter((f) => { return f.title === feature.title }).length > 0
      if (isAdded) {
        childrenDom.push(
          <FeatureList.Item
            key={idx}
            icon={ <img src={feature.icon} /> }
            title={ feature.title }
            description={ feature.description } 
          />
        )
      }
    })
  }
  return (
    <div className="feature-list">
      { childrenDom }
    </div>
  )
}
FeatureList.propTypes = {
  children: PropTypes.any,
  addedFeatures: PropTypes.array
}

const FeatureListItem = ({icon, title, description, children}) => (
  <div className="feature-list-item">
    {icon && <div className="icon-col">{icon}</div>}
    <div className="content-col">
      <h4>{title}</h4>
      <p className={cn({bigger: !icon})}>{description}</p>
      {children && <div className="child-component">{children}</div>}
    </div>
  </div>
)

FeatureListItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.any.isRequired,
  description: PropTypes.any.isRequired,
  children: PropTypes.any
}

FeatureList.Item = FeatureListItem

export default FeatureList
