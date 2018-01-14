import React from 'react'
import CheckDark from '../../assets/images/check-dark.svg'

class IconCheckDark extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <CheckDark className={className}/>
            </object>
        )
    }
}

export default IconCheckDark