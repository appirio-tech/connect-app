import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import styles from './CardListHeader.scss'

/**
 * Renders the header for a topic group (e.g new messages, earlier messages).
 * Including the adminCount, all / admin onely filter, etc.
 *
 * @param {object} props - the input props for the component
 * @param {string} props.title - The title
 * @param {number} props.adminCount - Number of private topics (only admin can view) under the group
 * @param {function} props.onAdminFilterChange - A callback to notify all/admin only filter change
 * @param {bool} props.onlyAdmin - all / admin only selection
 */
const CardListHeader = ({ title, adminCount, onlyAdmin, onAdminFilterChange }) => (
  <div className={styles.container}>
    <span className={styles.topicTitle}>{title}</span>

    {/* All or Admin only filter */}
    <section>
      <span
        className={cn(styles.filterItem, {
          [styles.selected]: !onlyAdmin
        })}
        onClick={() => onAdminFilterChange(false)}
      >
        All
      </span>

      <span
        className={cn(styles.filterItem, styles.adminFilter, { [styles.selected]: onlyAdmin })}
        onClick={() => onAdminFilterChange(true)}
      >
        Admin Only

        <span className={styles.count}>{adminCount}</span>
      </span>
    </section>
  </div>
)

CardListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  adminCount: PropTypes.number.isRequired,
  onAdminFilterChange: PropTypes.func.isRequired,
  onlyAdmin: PropTypes.bool
}

export default CardListHeader
