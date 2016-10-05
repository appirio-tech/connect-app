import React, { PropTypes } from 'react'

const RedirectComponent = (props) => {
  debugger
  window.location = props.redirectTo
}

RedirectComponent.propTypes = {
  redirectTo: PropTypes.string.isRequired
}

export default RedirectComponent
