import React from 'react'
import AddColor from  '../../assets/images/icon-add-color.svg'

class IconAddColor extends React.Component {
    
  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <AddColor className={className}/>
      </object>
    )
  }
}

export default IconAddColor