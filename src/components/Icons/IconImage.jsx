import React from 'react'
import Image from '../../assets/images/users-16px_single-01.svg'

class IconImage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Image className={className}/>
      </object>
    )
  }
}

export default IconImage