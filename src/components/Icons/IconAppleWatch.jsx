import React from 'react'
import AppleWatch from '../../assets/images/tech-32-outline_watch-time.svg'

class IconAppleWatch extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <AppleWatch className={className}/>
            </object>
        )
    }
}

export default IconAppleWatch