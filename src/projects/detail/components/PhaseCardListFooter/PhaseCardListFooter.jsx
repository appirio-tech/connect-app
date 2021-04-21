/**
 * Footer component for the list of PhaseCard components
 */
import React from 'react'
import PT from 'prop-types'

import './PhaseCardListFooter.scss'

const PhaseCardListFooter = ({
  duration,
  price,
  minStartDate,
  maxEndDate,
}) => (
  <div>
    <div styleName="container">
      <div styleName="main">
        <div styleName="total">Total:</div>
        <div styleName="meta-list">
          <span styleName="meta"><label>Duration:</label>{duration}</span>
          <span styleName="meta"><label>Start Date:</label>{minStartDate.format('YYYY-MM-DD')}</span>
          <span styleName="meta"><label>End Date:</label>{maxEndDate.format('YYYY-MM-DD')}</span>
        </div>
      </div>
      {parseInt(price, 10) > 0 &&  <div styleName="price">price</div> }
      <div styleName="status" />
    </div>
  </div>
)

PhaseCardListFooter.defaultProps = {
  duration: null,
  price: null,
  minStartDate: null,
  maxEndDate: null,
  projectId: 0
}

PhaseCardListFooter.propTypes = {
  duration: PT.string,
  price: PT.string,
  minStartDate: PT.Date,
  maxEndDate: PT.Date,
}

export default PhaseCardListFooter
