import React from 'react'
import TailLeft from '../../assets/images/arrows-16px-1_tail-left.svg'

class IconTailLeft extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <TailLeft className={className}/>
      </object>
    )
  }
}

export default IconTailLeft