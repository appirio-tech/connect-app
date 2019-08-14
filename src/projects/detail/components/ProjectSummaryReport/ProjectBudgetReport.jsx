import React from 'react'
import PT from 'prop-types'
import { formatNumberWithCommas } from '../../../../helpers/format'
import PERMISSIONS from '../../../../config/permissions'
import { checkPermission } from '../../../../helpers/permissions'
import './ProjectBudgetReport.scss'

const ProjectBudgetReport = ({ budget, project }) => {
  const { work, fees, revenue, remaining } = budget

  const total = revenue + remaining
  const showSpentData = checkPermission(PERMISSIONS.ACCESS_BUDGET_SPENT_REPORT, project)
  const showInvoiceData = checkPermission(PERMISSIONS.ACCESS_INVOICE_REPORT, project)
  const workSpentBarWidth = (work / total) * 100
  const feeBarWidth = (fees / total) * 100
  const invoicedBarWidth = (revenue / total) * 100

  return (
    <div>
      <div styleName="header">
        <div styleName="title-and-description">
          <h1 styleName="title">PROJECT BUDGET</h1>
          <div styleName="description">
            Expected delivery on-target
          </div>
        </div>
        { showSpentData && work !== null && work !== undefined &&
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="work circle"/>
            ${formatNumberWithCommas(work)}
          </div>
          <div styleName="part-of-budget">
            WORK
          </div>
        </div>
        }
        { showSpentData && fees !== null && fees !== undefined &&
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="fees circle"/>
          ${formatNumberWithCommas(fees)}</div>
          <div styleName="part-of-budget">
            FEES
          </div>
        </div>
        }
        { showInvoiceData && revenue !== null && revenue !== undefined &&
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="revenue circle"/>
            ${formatNumberWithCommas(revenue)}</div>
          <div styleName="part-of-budget">
            INVOICED
          </div>
        </div>
        }
        { showInvoiceData && remaining !== null && remaining !== undefined &&
        <div styleName="budget-part">
          <div styleName="money">
            <div styleName="remaining circle"/>
            ${formatNumberWithCommas(remaining)}</div>
          <div styleName="part-of-budget">
            REMAINING
          </div>
        </div>
        }
      </div>
      { showSpentData &&
        <div styleName="budget-distribution">
          <div styleName="work budget-distribution-part" style={{ width:  `${workSpentBarWidth}%`}} />
          <div styleName="fees budget-distribution-part" style={{ width:  `${feeBarWidth}%`}} />
        </div>
      }
      <div styleName="budget-distribution">
        { showInvoiceData && <div styleName="revenue budget-distribution-part" style={{ width:  `${invoicedBarWidth}%`}} /> }
      </div>
    </div>
  )
}

ProjectBudgetReport.propTypes = {
  budget: PT.object.isRequired,
}

export default ProjectBudgetReport
