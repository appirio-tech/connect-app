import React from 'react'
import BtnClose from '../../assets/images/x-mark-big.svg'

class IconBtnClose extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <BtnClose className={className}/>
            </object>
        )
    }
}

export default IconBtnClose