import React from 'react'
import CarretDownActive from '../../assets/images/arrow-6px-carret-down-active.svg'

class IconCarretDownActive extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {icon} = this.props
        return(
            <object>
                <CarretDownActive className="icon-carret-down-active"/>
            </object>
        )
    }
}

export default IconCarretDownActive