/**
 * generic button with icon
 */
import React from 'react'
import PropTypes from 'prop-types'
import './IconButton.scss'

const IconButton = ({ Icon, onClick }) => {

  return (
    <div styleName="button" onClick={onClick}>
      <Icon />
    </div>
  )
}

IconButton.propTypes = {
  Icon: PropTypes.func.isRequired,
  onClick: PropTypes.func
}

export default IconButton
