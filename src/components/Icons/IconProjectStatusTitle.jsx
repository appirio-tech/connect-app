import React from 'react'
import ProjectStatusTitle from '../../assets/images/status-ico.svg'

class IconProjectStatusTitle extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <ProjectStatusTitle className={className}/>
      </object>
    )
  }
}

export default IconProjectStatusTitle