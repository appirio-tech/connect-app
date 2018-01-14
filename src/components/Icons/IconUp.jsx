import React from 'react'
import Up from '../Grid/images/arrow-up-big.svg'

class IconUp extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <Up className={className}/>
            </object>
        )
    }
}

export default IconUp