import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import styles from './CardListHeader.scss'

/**
 * Renders the header for a topic group (e.g new messages, earlier messages).
 * Including the count, all / admin onely filter, etc.
 *
 * @param {object} props - the input props for the component
 * @param {string} props.title - The title
 * @param {number} props.count - Number of topics under the group
 * @param {function} props.onAdminFilterChange - A callback to notify all/admin only filter change
 * @param {bool} props.onlyAdmin - all / admin only selection
 */
const CardListHeader = ({ title, count, onlyAdmin, onAdminFilterChange }) => (
  <div className={styles.container}>
    <span className={styles.topicTitle}>{title}</span>

    {/* All or Admin only filter */}
    <section>
      <span
        className={cn(styles.adminFilterItem, {
          [styles.selected]: !onlyAdmin
        })}
        onClick={() => onAdminFilterChange(false)}
      >
        All
      </span>

      <span
        className={cn(styles.adminFilterItem, { [styles.selected]: onlyAdmin })}
        onClick={() => onAdminFilterChange(true)}
      >
        Admin Only
      </span>

      <span className={styles.count}>{count}</span>
    </section>
  </div>
)

CardListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onAdminFilterChange: PropTypes.func.isRequired,
  onlyAdmin: PropTypes.bool
}

export default CardListHeader
