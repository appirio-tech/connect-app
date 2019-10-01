import React from 'react'
import PT from 'prop-types'

import MenuItem from '../MenuItem/MenuItem'

import styles from './MenuList.scss'

const MenuList = ({ navLinks, onAccordionToggle }) => (
  <nav className={styles.container}>
    <ul>
      {!!navLinks &&
        navLinks.map((link, i) => <MenuItem key={i} {...link} onAccordionToggle={(open) => onAccordionToggle(i, open)} />)}
    </ul>
  </nav>
)

MenuList.propTypes = {
  navLinks: PT.arrayOf(
    PT.shape({
      label: PT.string.isRequired,
      to: PT.string.isRequired,
      Icon: PT.func.isRequired,
      exact: PT.bool,
      isActive: PT.func,
      toolTipText: PT.string
    })
  ),
  onAccordionToggle: PT.func.isRequired
}

export default MenuList
