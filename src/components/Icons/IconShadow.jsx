import React from 'react'
import Shadow from '../../assets/images/ground-shadow.svg'

class IconShadow extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Shadow className={className}/>
      </object>
    )
  }
}

export default IconShadow