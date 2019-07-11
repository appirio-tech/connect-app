/**
 * generic button with icon
 */
import React from 'react'
import PropTypes from 'prop-types'
import './IconButton.scss'

const IconButton = ({ icon, onClick }) => {
  const Icon = icon

  return (
    <div styleName="button" onClick={onClick}>
      <Icon />
    </div>
  )
}

IconButton.propTypes = {
  icon: PropTypes.func.isRequired,
  onClick: PropTypes.func
}

export default IconButton
