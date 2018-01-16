import React from 'react'
import DontKnow from '../../assets/images/icon-dont-know.svg'

class IconDontKnow extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <DontKnow className={className}/>
      </object>
    )
  }
}

export default IconDontKnow