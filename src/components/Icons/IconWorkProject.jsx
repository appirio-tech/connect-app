import React from 'react'
import WorkProject from '../../assets/images/tech-32px-outline-work-project.svg'

class IconWorkProject extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <WorkProject className={className}/>
      </object>
    )
  }
}

export default IconWorkProject