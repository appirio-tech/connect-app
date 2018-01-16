import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './ProjectStatus.scss'
import SVGIcons from '../Icons/Icons'

/*eslint-enable camelcase */
const ProjectStatus = ({ status, showText, withoutLabel, unifiedHeader = true }) => {
  return (
    <div className={cn('ProjectStatus', 'ps-' + status.value, { 'unified-header': unifiedHeader })}>
      <SVGIcons.StatusIcons status={status.value} />
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
