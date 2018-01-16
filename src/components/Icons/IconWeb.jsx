import React from 'react'
import Web from '../../assets/images/tech-32-outline_desktop.svg'

class IconWeb extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Web className={className}/>
      </object>
    )
  }
}

export default IconWeb