/**
 * Header component for the list of PhaseCard components
 */
import React from 'react'
import PT from 'prop-types'
import SectionTitle from '../SectionTitle'

import './PhaseCardListHeader.scss'

const PhaseCardListHeader = ({hasPrice}) => (
  <div styleName="container">
    <div styleName="title">
      <SectionTitle title="Phases" />
    </div>
    {hasPrice && <div styleName="price">Price</div>}
    <div styleName="status">Status</div>
  </div>
)

PhaseCardListHeader.propTypes = {
  hasPrice: PT.bool,
}

PhaseCardListHeader.defaultProps = {
  hasPrice: true,
}
export default PhaseCardListHeader
