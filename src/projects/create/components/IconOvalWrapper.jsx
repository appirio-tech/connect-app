import React from 'react'
import PropTypes from 'prop-types'
import './IconOvalWrapper.scss'
import OvalBackgroundIcon from '../../../assets/icons/v.2.5/oval.svg'


function IconOvalWrapper({ children }) {
  return (
    <div styleName="icon-wrapper">
      <OvalBackgroundIcon/>
      {children}
    </div>  
  )
}

IconOvalWrapper.propTypes = {
  children: PropTypes.element
}

export default IconOvalWrapper
