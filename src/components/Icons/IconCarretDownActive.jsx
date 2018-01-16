import React from 'react'
import CarretDownActive from '../../assets/images/arrow-6px-carret-down-active.svg'

class IconCarretDownActive extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <CarretDownActive className={className}/>
      </object>
    )
  }
}

export default IconCarretDownActive