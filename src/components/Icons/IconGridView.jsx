import React from 'react'
import GridView from '../../assets/images/grid-list-ico.svg'

class IconGridView extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <GridView className={className}/>
            </object>
        )
    }
}

export default IconGridView