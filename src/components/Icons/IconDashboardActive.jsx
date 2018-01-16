import React from 'react'
import DashboardActive from  '../../styles/i/icon-dashboard-active.svg'

class IconDashboardActive extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <DashboardActive className={className}/>
      </object>
    )
  }
}

export default IconDashboardActive