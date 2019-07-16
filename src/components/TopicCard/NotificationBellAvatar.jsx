import React from 'react'

import BellIcon from '../../assets/icons/bell-avatar.svg'
import styles from './NotificationBellAvatar.scss'

export default () => (
  <div className={styles.circle}>
    <BellIcon className={styles.icon} />
  </div>
)
