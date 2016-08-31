import React from 'react'

require('./FeaturePreview.scss')

const FeaturePreview = props => {
  const { feature, addingCustomFeature } = props
  let previewImg = null
  // if feature is activated and is not a customer feature
  if (feature && !feature.custom) {
    previewImg = require('./images/' + feature.title + '.png')
  } else if ((feature && feature.custom) || addingCustomFeature) { // if active/non-active custom feature
    previewImg = require('./images/Custom-feature.png')
  } else {
    previewImg = require('./images/Default-preview.png')
  }
  return (
    <div className="feature-preview flex-grow">
      <img src={ previewImg } />
    </div>
  )
}

export default FeaturePreview