import React from 'react'
import IPhone from '../../assets/images/tech-32-outline_mobile.svg'

class IconIPhone extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <IPhone className={className}/>
            </object>
        )
    }
}

export default IconIPhone