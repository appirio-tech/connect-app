import { PropTypes } from 'react'

const RedirectComponent = (props) => {
  window.location = props.redirectTo
}

RedirectComponent.propTypes = {
  redirectTo: PropTypes.string.isRequired
}

export default RedirectComponent
