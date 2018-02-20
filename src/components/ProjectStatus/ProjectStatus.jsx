import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './ProjectStatus.scss'
import IconStatusActive from '../../assets/icons/status-active.svg'
import IconStatusDraft from '../../assets/icons/status-draft.svg'
import IconStatusReview from '../../assets/icons/status-in_review.svg'
import IconStatusReviewed from '../../assets/icons/status-reviewed.svg'
import IconStatusCancelled from '../../assets/icons/status-cancelled.svg'
import IconStatusPaused from '../../assets/icons/status-paused.svg'
import IconStatusCompleted from '../../assets/icons/status-completed.svg'


/**
 * @params {string} status project status
 */
const StatusIcons = ({ status }) => {
  switch(status){
  case 'active':
    return <IconStatusActive className="active-status-icon" />
  case 'draft':
    return <IconStatusDraft className="draft-status-icon" />
  case 'in_review':
    return <IconStatusReview className="review-status-icon" />
  case 'reviewed':
    return <IconStatusReviewed className="reviewed-status-icon" />
  case 'cancelled':
    return <IconStatusCancelled className="cancelled-status-icon" />
  case 'completed':
    return <IconStatusCompleted className="completed-status-icon" />
  case 'paused':
    return <IconStatusPaused className="paused-status-icon" />
  default:
    return 'undefined icon'
  }
}

StatusIcons.propTypes = {
  status: PropTypes.string
}

/*eslint-enable camelcase */
const ProjectStatus = ({ status, showText, withoutLabel, unifiedHeader = true }) => {
  return (
    <div className={cn('ProjectStatus', 'status-' + status.value, { 'unified-header': unifiedHeader })}>
      <StatusIcons status={status.value} />
      {showText && (<span className="status-label">{withoutLabel ? status.fullName : status.name}</span>)}
    </div>
  )
}

ProjectStatus.propTypes = {
  // status: PropTypes.oneOf(['draft', 'active', 'in_review', 'reviewed', 'completed', 'paused', 'cancelled']).isRequired
  /**
   * Status object, containing name, fullName and value fields
   */
  status         : PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object
  ]).isRequired,
  /**
   * Boolean flag to render the status text
   */
  showText       : PropTypes.bool,
  /**
   * Boolean flag to render the more detailed status text (fullName field form the status object).
   * Its main use case is the place where we don't show a label like `Project Status` before rendering
   * this component.
   */
  withoutLabel   : PropTypes.bool,
  /**
   * Boolean flag to render a unified(with common background color) project status. It is added for backward
   * compaitability only. We are not rendering this type of view of project status anymore.
   */
  unifiedHeader  : PropTypes.bool
}

ProjectStatus.defaultProps = {
  showText        : true,
  withoutLabel    : false,
  unifiedHeader   : false
}

export default ProjectStatus
