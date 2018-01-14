import React from 'react'
import BtnRemove from '../../assets/images/ui-16px-1_trash-simple.svg'

class IconBtnRemove extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <BtnRemove className={className}/>
            </object>
        )
    }
}

export default IconBtnRemove