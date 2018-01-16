import React from 'react'
import InputIcon from  '../../assets/images/username-icon.svg'

class IconInputIcon extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <InputIcon className={className}/>
      </object>
    )
  }
}

export default IconInputIcon