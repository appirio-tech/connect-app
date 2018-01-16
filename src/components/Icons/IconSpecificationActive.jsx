import React from 'react'
import SpecificationActive from  '../../styles/i/icon-ruler-pencil-active.svg'

class IconSpecificationActive extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <SpecificationActive className={className}/>
      </object>
    )
  }
}

export default IconSpecificationActive