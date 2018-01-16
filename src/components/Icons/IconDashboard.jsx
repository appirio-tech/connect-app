import React from 'react'
import Dashboard from  '../../styles/i/icon-dashboard.svg'

class IconDashboard extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Dashboard className={className}/>
      </object>
    )
  }
}

export default IconDashboard