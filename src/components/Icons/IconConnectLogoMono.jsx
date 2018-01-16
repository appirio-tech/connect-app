import React from 'react'
import ConnectLogoMono from '../../assets/images/connect-logo-mono.svg'

class IconConnectLogoMono extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <ConnectLogoMono className={className}/>
      </object>
    )
  }
}

export default IconConnectLogoMono