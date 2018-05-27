/**
 * Header component for the list of PhaseCard components
 */
import React from 'react'

import SectionTitle from '../SectionTitle'

import './PhaseCardListHeader.scss'

const PhaseCardListHeader = () => (
  <div styleName="container">
    <div styleName="title">
      <SectionTitle title="Stages" />
    </div>
    <div styleName="price">Price</div>
    <div styleName="status">Status</div>
  </div>
)

export default PhaseCardListHeader
