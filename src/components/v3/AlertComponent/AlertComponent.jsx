import React from 'react'
import PT from 'prop-types'
import './AlertComponent.scss'

const AlertComponent = (props) => {
  return (
    <div styleName={'message-window ' + (props.type ? props.type : '')}>
      <a styleName="close" />
      <h2 styleName="title">{props.title}</h2>
      <div styleName="message">{props.message}</div>
    </div>
  )
}

AlertComponent.propTypes = {
  title: PT.string,
  message: PT.string,
  type: PT.string
}

export default AlertComponent
