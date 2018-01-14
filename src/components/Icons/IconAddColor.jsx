import React from 'react'
import AddColor from  '../../assets/images/icon-add-color.svg'

class IconAddColor extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {icon} = this.props
        return(
            <object>
                <AddColor className="icon-add-color"/>
            </object>
        )
    }
}

export default IconAddColor