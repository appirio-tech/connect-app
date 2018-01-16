import React from 'react'
import XMark from '../../assets/images/x-mark.svg'

class IconXMark extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <XMark className={className}/>
      </object>
    )
  }
}

export default IconXMark