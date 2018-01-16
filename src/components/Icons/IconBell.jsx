import React from 'react'
import Bell from '../../assets/images/ui-bell.svg'

class IconBell extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Bell className={className}/>
      </object>
    )
  }
}

export default IconBell