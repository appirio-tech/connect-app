import React from 'react'
import DeviceIphone from '../../projects/detail/components/FeatureSelector/images/Device-iPhone.svg'

class IconDeviceIphone extends React.Component {

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
    const {className, maskUrl} = this.props
    this.state.maskUrl = maskUrl
    return(
      <object>
        <DeviceIphone className={className}/>
      </object>
    )
  }
}

export default IconDeviceIphone