import React from 'react'
import CoderBroken from '../../assets/images/coder-broken.svg'

class IconCoderBroken extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <CoderBroken className={className}/>
            </object>
        )
    }
}

export default IconCoderBroken