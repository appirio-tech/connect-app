/**
 * Footer component for the list of PhaseCard components
 */
import React from 'react'
import PT from 'prop-types'

import './PhaseCardListFooter.scss'

const PhaseCardListFooter = ({
  duration,
  price,
  startEndDates,
}) => (
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
)

PhaseCardListFooter.defaultProps = {
  duration: null,
  price: null,
  startEndDates: null,
}

PhaseCardListFooter.propTypes = {
  duration: PT.string,
  price: PT.string,
  startEndDates: PT.string,
}

export default PhaseCardListFooter
