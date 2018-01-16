import React from 'react'
import Robot from '../../assets/images/coder-welcome.svg'

class IconRobot extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Robot className={className}/>
      </object>
    )
  }
}

export default IconRobot