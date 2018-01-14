import React from 'react'
import Ipad from '../../assets/images/tech-32-outline_tablet-button.svg'

class IconIpad extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <Ipad className={className}/>
            </object>
        )
    }
}

export default IconIpad