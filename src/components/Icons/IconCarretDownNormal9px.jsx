import React from 'react'
import CarretDownNormal9px from '../../assets/images/arrow-9px-carret-down-normal.svg'

class IconCarretDownNormal9px extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
        <object>
            <CarretDownNormal9px className={className}/>
        </object>
    )
  }
}

export default IconCarretDownNormal9px