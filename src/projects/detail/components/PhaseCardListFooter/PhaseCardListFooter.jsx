/**
 * Footer component for the list of PhaseCard components
 */
import React from 'react'
import PT from 'prop-types'
import { Link } from 'react-router-dom'

import './PhaseCardListFooter.scss'

const PhaseCardListFooter = ({
  duration,
  price,
  startEndDates,
  projectId,
  isManageUser,
  isProjectLive
}) => (
  <div>
    <div styleName="container">
      <div styleName="main">
        <div styleName="total">Total:</div>
        <div styleName="meta-list">
          <span styleName="meta">{duration}</span>
          <span styleName="meta meta-dark">{startEndDates}</span>
        </div>
      </div>
      <div styleName="price">{price}</div>
      <div styleName="status" />
    </div>
    {isProjectLive && isManageUser && (<div styleName="add-button-contaner">
      <Link to={`/projects/${projectId}/add-phase`} className="tc-btn tc-btn-primary tc-btn-sm action-btn">Add New Phase</Link>
    </div>)}
  </div>
)

PhaseCardListFooter.defaultProps = {
  duration: null,
  price: null,
  startEndDates: null,
  projectId: 0
}

PhaseCardListFooter.propTypes = {
  duration: PT.string,
  price: PT.string,
  startEndDates: PT.string,
  projectId: PT.number,
  isManageUser: PT.bool,
  isProjectLive: PT.bool
}

export default PhaseCardListFooter
