/**
 * Title for sections of notifications
 *
 * Can be two types depend on isGlobal flag
 */
import React from 'react'
import PropTypes from 'prop-types'
import './NotificationsSectionTitle.scss'

const NotificationsSectionTitle = (props) => {
  return (
    <section className={'notifications-section-title' + (props.isGlobal ? ' global' : '')}>
      {props.isGlobal ?
        <h2 className="title">{props.title}</h2> :
        <h3 className="title">{props.title}</h3>
      }
      {props.onMarkAllClick &&
        <div className="controls">
          <button className="tc-btn tc-btn-sm tc-btn-link mark-all" onClick={props.onMarkAllClick}>Mark All</button>
        </div>
      }
    </section>
  )
}

NotificationsSectionTitle.propTypes = {
  isGlobal: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onMarkAllClick: PropTypes.func
}

export default NotificationsSectionTitle
