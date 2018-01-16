import React from 'react'
import Down from '../Grid/images/arrow-down-big.svg'

class IconDown extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Down className={className}/>
      </object>
    )
  }
}

export default IconDown