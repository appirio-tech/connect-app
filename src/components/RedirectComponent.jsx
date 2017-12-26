import PropTypes from 'prop-types'

const RedirectComponent = (props) => {
  window.location = props.redirectTo
  return null
}

RedirectComponent.propTypes = {
  redirectTo: PropTypes.string.isRequired
}

export default RedirectComponent
