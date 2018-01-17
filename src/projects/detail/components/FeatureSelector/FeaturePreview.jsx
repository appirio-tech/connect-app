import React from 'react'
import PT from 'prop-types'
import DeviceIphone from '../../../../assets/icons/Device-iPhone.svg'

require('./FeaturePreview.scss')

/**
 * @params {string} class name
 */
const IconDeviceIphone = ({className}) => {
  return <DeviceIphone className={className}/>
}

IconDeviceIphone.propTypes = {
  className: PT.string.isRequired
}

class FeaturePreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {maskUrl: ''}
  }

  componentDidMount() {
    document.querySelector('.mask').href.baseVal = this.state.maskUrl
  }

  componentDidUpdate() {
    document.querySelector('.mask').href.baseVal = this.state.maskUrl
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
    this.state.maskUrl = previewImg
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
        <IconDeviceIphone className="icon-feature-preview-img" />
      </div>
    )
  }
}

export default FeaturePreview
