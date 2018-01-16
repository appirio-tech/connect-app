import React from 'react'
import Specification from  '../../styles/i/icon-ruler-pencil.svg'

class IconSpecification extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Specification className={className}/>
      </object>
    )
  }
}

export default IconSpecification