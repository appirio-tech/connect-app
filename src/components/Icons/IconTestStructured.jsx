import React from 'react'
import TestStructured from '../../assets/images/icon-test-structured.svg'

class IconTestStructured extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <TestStructured className={className}/>
      </object>
    )
  }
}

export default IconTestStructured