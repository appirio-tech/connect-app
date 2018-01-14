import React from 'react'
import CarretDownNormal from '../../assets/images/arrow-6px-carret-down-normal.svg'

class IconCarretDownNormal extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {icon} = this.props
        return(
            <object>
                <CarretDownNormal className="icon-carret-down-normal"/>
            </object>
        )
    }
}

export default IconCarretDownNormal