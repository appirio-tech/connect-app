/**
 * Milestone type 'reporting`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import MilestoneDescription from '../../MilestoneDescription'
import { withMilestoneExtensionRequest } from '../../MilestoneExtensionRequest'
import { getMilestoneStatusText } from '../../../../../../helpers/milestoneHelper'

import {
  MILESTONE_STATUS
} from '../../../../../../config/constants'

import './MilestoneTypeReporting.scss'
import { hasPermission } from '../../../../../../helpers/permissions'
import { PERMISSIONS } from '../../../../../../config/permissions'

class MilestoneTypeReporting extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditingReport: false,
      reportText: '',
    }

    this.onClickProvideReport = this.onClickProvideReport.bind(this)
    this.onReportTextChange = this.onReportTextChange.bind(this)
    this.onClickPublishReport = this.onClickPublishReport.bind(this)
    this.onClickCancelProvideReport = this.onClickCancelProvideReport.bind(this)
    this.onClickSaveReport = this.onClickSaveReport.bind(this)
  }

  onClickProvideReport() {
    const { milestone } = this.props

    this.setState({
      isEditingReport: true,
      reportText: _.get(milestone, 'details.content.report')
    })
  }

  onClickCancelProvideReport() {
    this.setState({
      isEditingReport: false,
    })
  }

  onReportTextChange(event) {
    this.setState({
      reportText: event.target.value,
    })
  }

  onClickPublishReport() {
    const { reportText } = this.state
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({ report: reportText }, undefined, MILESTONE_STATUS.COMPLETED)
  }

  onClickSaveReport() {
    const { reportText } = this.state
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({ report: reportText })
  }

  render() {
    const {
      milestone,
      theme,
    } = this.props
    const {
      isEditingReport,
      reportText,
    } = this.state

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    const canManage = hasPermission(PERMISSIONS.MANAGE_MILESTONE)

    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideFirstLine>
          <MilestoneDescription description={getMilestoneStatusText(milestone)} />
        </DotIndicator>

        {/* Report Edit */}
        {isEditingReport && (
          <DotIndicator hideLine>
            <textarea rows="10" className="tc-textarea" styleName="report-textarea" type="text" onChange={this.onReportTextChange} value={reportText}/>
            <div className="flex center" styleName="btns-container">
              <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickCancelProvideReport}>Cancel</button>
              {
                isCompleted ? (
                  <button type="button" className="tc-btn tc-btn-primary" onClick={this.onClickSaveReport} disabled={!reportText}>Save changes</button>
                ) : (
                  <button type="button" className="tc-btn tc-btn-primary" onClick={this.onClickPublishReport} disabled={!reportText}>Publish report</button>
                )
              }
            </div>
          </DotIndicator>
        )}

        {/*
          Active status
         */}
        {isActive && (
          <DotIndicator hideLine>
            {canManage && (
              !isEditingReport && (
                <div className="flex center" styleName="btns-container">
                  <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickProvideReport}>Provide report</button>
                </div>
              )
            )}
          </DotIndicator>
        )}

        {/* Completed status */}
        {isCompleted && !isEditingReport && (
          <DotIndicator hideLine>
            <div styleName="view-report-text">{_.get(milestone, 'details.content.report', '')}</div>
            {
              canManage && (
                <div className="flex center" styleName="btns-container">
                  <button type="button" className="tc-btn tc-btn-default" onClick={this.onClickProvideReport}>Edit</button>
                </div>
              )
            }
          </DotIndicator>
        )}

      </div>
    )
  }
}

MilestoneTypeReporting.defaultProps = {
  theme: null,
}

MilestoneTypeReporting.propTypes = {
  milestone: PT.object,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
}

export default withMilestoneExtensionRequest(MilestoneTypeReporting)
