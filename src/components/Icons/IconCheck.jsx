import React from 'react'
import Check from '../../assets/images/check.svg'

class IconCheck extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Check className={className}/>
      </object>
    )
  }
}

export default IconCheck