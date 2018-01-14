import React from 'react'
import TextImg from '../../assets/images/pointer-new-project.svg'

class IconTextImg extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <TextImg className={className}/>
            </object>
        )
    }
}

export default IconTextImg