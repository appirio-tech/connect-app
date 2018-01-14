import React from 'react'
import ChallengesActive from  '../../styles/i/icon-hammer-active.svg'

class IconChallengesActive extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <ChallengesActive className={className}/>
            </object>
        )
    }
}

export default IconChallengesActive