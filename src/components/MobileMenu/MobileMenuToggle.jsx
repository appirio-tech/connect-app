/**
 * Mobile menu (hamburger) button
 */
import React from 'react'
import PropTypes from 'prop-types'
import HamburgerIcon from '../../assets/icons/hamburger_icon.svg'
import './MobileMenuToggle.scss'

const MobileMenuToggle = ({ onToggle }) => (
  <div styleName="toggle" onClick={onToggle}>
    <HamburgerIcon />
  </div>
)

MobileMenuToggle.propTypes = {
  onToggle: PropTypes.func,
}

export default MobileMenuToggle
