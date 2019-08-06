import React from 'react'
import PT from 'prop-types'
import { formatNumberWithCommas } from '../../../../helpers/format'
import './ProjectBudgetReport.scss'

const ProjectBudgetReport = ({ budget }) => {
  const { work, fees, revenue, remaining } = budget

  const total = work + fees + revenue + remaining

  return (
    <div>
      <div styleName="header">
        <div styleName="title-and-description">
          <h1 styleName="title">PROJECT BUDGET</h1>
          <div styleName="description">
            Expected delivery on-target
          </div>
        </div>
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="work circle"/>
            ${formatNumberWithCommas(work)}
          </div>
          <div styleName="part-of-budget">
            WORK
          </div>
        </div>
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="fees circle"/>
          ${formatNumberWithCommas(fees)}</div>
          <div styleName="part-of-budget">
            FEES
          </div>
        </div>
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="revenue circle"/>
            ${formatNumberWithCommas(revenue)}</div>
          <div styleName="part-of-budget">
            REVENUE
          </div>
        </div>
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="remaining circle"/>
            ${formatNumberWithCommas(remaining)}</div>
          <div styleName="part-of-budget">
            REMAINING
          </div>
        </div>
      </div>
      <div styleName="budget-distribution">
        <div styleName="work budget-distribution-part" style={{ width:  `${(work / total) * 100}%`}} />
        <div styleName="fees budget-distribution-part" style={{ width:  `${(fees / total) * 100}%`}} />
        <div styleName="revenue budget-distribution-part" style={{ width:  `${(revenue / total) * 100}%`}} />
      </div>
    </div>
  )
}

ProjectBudgetReport.propTypes = {
  budget: PT.object.isRequired,
}

export default ProjectBudgetReport
