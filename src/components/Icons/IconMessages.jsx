import React from 'react'
import Messages from  '../../styles/i/icon-chat.svg'

class IconMessages extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <Messages className={className}/>
            </object>
        )
    }
}

export default IconMessages