import React from 'react'
import MessagesActive from  '../../styles/i/icon-chat-active.svg'

class IconMessagesActive extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {className} = this.props
        return(
            <object>
                <MessagesActive className={className}/>
            </object>
        )
    }
}

export default IconMessagesActive