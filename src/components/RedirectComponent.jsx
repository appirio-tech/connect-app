import { PropTypes } from 'react'

const RedirectComponent = (props) => {
  window.location = props.redirectTo
  return null
}

RedirectComponent.propTypes = {
  redirectTo: PropTypes.string.isRequired
}

export default RedirectComponent
