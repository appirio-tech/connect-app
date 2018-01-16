import React from 'react'
import DirectArrow from '../../assets/images/icon-direct-arrow.svg'

class IconDirectArrow extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <DirectArrow className={className}/>
      </object>
    )
  }
}

export default IconDirectArrow