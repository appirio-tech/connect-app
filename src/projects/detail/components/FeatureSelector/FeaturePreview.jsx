import React from 'react'
import SVGIcons from '../../../../components/Icons/Icons'

require('./FeaturePreview.scss')

class FeaturePreview extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    
    const { feature, addingCustomFeature } = this.props
    let previewImg = null
    if (!feature && !addingCustomFeature) {
      previewImg = require('./images/Default-preview.png')
    } else if (addingCustomFeature || feature.categoryId === 'custom') {
      previewImg = require('./images/Custom-feature.png')
    } else {
      // TODO change image names to match feature id
      previewImg = require('./images/' + feature.title + '.png')
    }

    // // if feature is activated and is not a customer feature
    // if (feature && feature.type !== 'custom') {
    //   previewImg = require('./images/' + feature.title + '.png')
    // } else if ((feature && feature.custom) || addingCustomFeature) { // if active/non-active custom feature
    //   previewImg = require('./images/Custom-feature.png')
    // } else {
    //   previewImg = require('./images/Default-preview.png')
    // }
    return (
      <div className="feature-preview flex-grow">
        <SVGIcons.IconDeviceIphone maskUrl={previewImg} className="icon-feature-preview-img" />
      </div>
    )
  }
}

export default FeaturePreview
