/**
 * View / edit milestone record
 */
import React from 'react'
import PT from 'prop-types'
import {
  PHASE_APPROVAL_APPROVE,
  PHASE_APPROVAL_REJECT,
  PHASE_STATUS_IN_REVIEW,
  PHASE_STATUS_REVIEWED,
} from '../../../../../../config/constants'
import IconCollapse from '../../../../../../assets/icons/icon-ui-collapse.svg'
import * as _ from 'lodash'

import MilestoneApprovalButton from '../MilestoneApprovalButton'
import './MilestonesApprovalNotification.scss'

class MilestonesApprovalNotification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      show: true,
    }

    this.findLatest = this.findLatest.bind(this)
  }

  findLatest(approvals) {
    if(!approvals) return {}
    
    let d = null
    let maxIndex = 0
    for(let index = 0; index <  approvals.length; index ++) {
      const tmp = new Date(approvals[index].createdAt)
      if(!d) {
        d = tmp
        continue
      }
      if(d < tmp) {
        d = tmp
        maxIndex = index
      }
    }
    return approvals[maxIndex] || {}
  }

  render() {
    const { milestones } = this.props

    console.log('milestones', milestones)
    
    const inReviews = milestones.find(
      (ms) => ms.status === PHASE_STATUS_IN_REVIEW
    )
    const revieweds = milestones.filter(
      (ms) => ms.status === PHASE_STATUS_REVIEWED
    ).map( ms => {ms.currentApproval = this.findLatest(ms.approvals); return ms})

    const showAllApproved =
      !inReviews && revieweds.length > 0 &&
      !revieweds.find(
        (rd) =>
          !!(
            rd.approvals && rd.currentApproval.decision !== PHASE_APPROVAL_APPROVE
          )
      )

    const groupRejecteds = () => {
      const group = []
      const skip = []
      revieweds.forEach((ms, index) => {
        if (skip.find((i) => i === index)) {
          return
        }
        // group item pre-definition
        const toPush = { items: null, comment: null }

        if (ms.currentApproval.decision === PHASE_APPROVAL_REJECT) {
          (toPush.items = [ms]), (toPush.comment = ms.currentApproval.comment)
        }
        revieweds.slice(index + 1).forEach((ms2, index2) => {
          if (
            ms2.currentApproval.decision === PHASE_APPROVAL_REJECT &&
            ms.currentApproval.comment === ms2.currentApproval.comment
          ) {
            toPush.items.push(ms2)
            skip.push(index2 + index + 1)
          }
        })
        if (toPush.items) {
          group.push(toPush)
        }
      })

      return group
    }

    const rejectedGroup = groupRejecteds()

    const renderDismissButton = (onClick) => (
      <button
        type="submit"
        className="tc-btn tc-btn-link"
        styleName={'dismiss-button'}
        onClick={() => {
          onClick()
        }}
      >
        <div styleName="title">DISMISS</div>
      </button>
    )

    if (showAllApproved && this.state.show) {
      return (
        <div styleName="approved-notifications">
          <div styleName="milestones-notifications">
            <div styleName="milestones-notifications-left">
              <button
                type="submit"
                className="tc-btn"
                styleName="tranparent-button"
                onClick={() => {
                  this.setState({ open: !this.state.open })
                }}
              >
                <IconCollapse
                  styleName={`icon-expand ${this.state.open ? 'open' : ''}`}
                />
              </button>
              The following milestone(s) has been approved&nbsp;
              <MilestoneApprovalButton
                type="approve"
              />
            </div>
            {renderDismissButton(() => {
              this.setState({ show: false })
            })}
          </div>
          {this.state.open && (
            <div styleName="body">
              {revieweds.map((item, key) => (
                <div
                  className="flex middle"
                  styleName="accordion-body-item"
                  key={key}
                >
                  <div styleName="body-item-one">
                    <p styleName="bullet">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (Object.keys(rejectedGroup).length > 0 && this.state.show) {
      return (
        <div styleName="reject-notifications">
          <div styleName={`trigger ${this.state.open ? 'open' : ''}`}>
            <div styleName="left">
              <button
                type="submit"
                className="tc-btn"
                styleName="tranparent-button"
                onClick={() => {
                  this.setState({ open: !this.state.open })
                }}
              >
                <IconCollapse
                  styleName={`icon-expand ${this.state.open ? 'open' : ''}`}
                />
              </button>

              <div styleName="trigger-text">
                <strong>Milestone Customer Approval</strong>
                <div>
                  Please review the below comments, make appropriate changes
                </div>
              </div>
            </div>
            <div styleName="right">
              <div
                className="flex middle"
                styleName="trigger-action-reject"
                onClick={() => {
                  console.log('rejection clicked')
                }}
              >
                <MilestoneApprovalButton
                  type="reject"
                  hidePoper
                  global
                  onClick={() => {}}
                />
                Rejected
              </div>
              <div styleName="hs" />
              {renderDismissButton(() => {
                this.setState({ show: false })
              })}
            </div>
          </div>
          {this.state.open && (
            <div styleName="body">
              <div className="flex middle" styleName="accordion-body-item">
                <div styleName="body-item-one">Rejected Milestones</div>
                <div styleName="body-item-two">Comments</div>
              </div>
              {rejectedGroup.map((group, key) => (
                <div
                  className="flex middle"
                  styleName="accordion-body-item"
                  key={key}
                >
                  <div styleName="body-item-one">
                    {_.join(
                      group.items.map((ms) => ms.name),
                      ','
                    )}
                  </div>
                  <div styleName="body-item-two">{group.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return null
  }
}

MilestonesApprovalNotification.propTypes = {
  milestones: PT.arrayOf(PT.shape()),
}

export default MilestonesApprovalNotification
