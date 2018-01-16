import React from 'react'
import AndroidWear from '../../assets/images/tech-32-outline_watch-circle.svg'

class IconAndroidWear extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <AndroidWear className={className}/>
      </object>
    )
  }
}

export default IconAndroidWear