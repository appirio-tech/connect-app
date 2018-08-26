/**
 * Footer component for the list of PhaseCard components
 */
import React from 'react'
import PT from 'prop-types'

import './PhaseCardListFooter.scss'

const PhaseCardListFooter = ({
  duration,
  price,
  startEndDates
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
      {parseInt(price, 10) > 0 &&  <div styleName="price">price</div> }
      <div styleName="status" />
    </div>
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
  startEndDates: PT.string
}

export default PhaseCardListFooter
