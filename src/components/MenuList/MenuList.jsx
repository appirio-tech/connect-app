import React from 'react'
import PT from 'prop-types'

import MenuItem from '../MenuItem/MenuItem'

import styles from './MenuList.scss'

const MenuList = ({ navLinks }) => (
  <nav className={styles.container}>
    <ul>
      {!!navLinks &&
        navLinks.map((link, i) => <MenuItem key={i} navLink={link} />)}
    </ul>
  </nav>
)

MenuList.propTypes = {
  navLinks: PT.arrayOf(
    PT.shape({
      label: PT.string,
      to: PT.string,
      Icon: PT.func
    })
  )
}

export default MenuList
