import React from 'react'
import Challenges from  '../../styles/i/icon-hammer.svg'

class IconChallenges extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {className} = this.props
    return(
      <object>
        <Challenges className={className}/>
      </object>
    )
  }
}

export default IconChallenges