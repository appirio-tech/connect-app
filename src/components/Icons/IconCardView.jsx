import React from 'react'
import CardView from '../../assets/images/ui-16px-2_grid-45-gray.svg'

class IconCardView extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <CardView className={className}/>
            </object>
        )
    }
}

export default IconCardView