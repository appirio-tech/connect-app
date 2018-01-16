import React from 'react'
import TestUnstructured from '../../assets/images/icon-test-unstructured.svg'

class IconTestUnstructured extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <TestUnstructured className={className}/>
      </object>
    )
  }
}

export default IconTestUnstructured