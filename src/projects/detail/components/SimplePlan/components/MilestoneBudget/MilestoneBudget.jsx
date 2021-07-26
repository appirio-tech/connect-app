/**
 * Milestone budget
 */
import React from 'react'
import PT from 'prop-types'

import './MilestoneBudget.scss'

function MilestoneBudget({ spent, budget }) {
  return (
    <div styleName="progress-bar">
      <div styleName="text">{budget > 0 ? `$${spent} of $${budget}` : `$${budget}`}</div>
      <div styleName="background"/>
      <div styleName="progress" style={{transform: `scaleX(${budget > 0 ? spent/budget : 0})`}}/>
    </div>
  )
}


MilestoneBudget.propTypes = {
  spent: PT.number,
  budget: PT.number,
}

export default MilestoneBudget
