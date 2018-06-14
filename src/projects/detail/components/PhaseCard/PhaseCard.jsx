/**
 * PhaseCard component
 * phase summary with expandable content
 */
import React from 'react'
import PT from 'prop-types'

import {
  PHASE_STATUS_PLANNED,
  PHASE_STATUS_IN_PROGRESS,
  PHASE_STATUS_DELIVERED,
} from '../../../../config/constants'

import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectTypeIcon from '../../../../components/ProjectTypeIcon'
import EditStageForm from './EditStageForm'
import { ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER } from '../../../../config/constants'

import './PhaseCard.scss'

// map project statuses with displayed statuses
const toPhaseCardStatus = {
  [PHASE_STATUS_PLANNED]: PHASE_STATUS_PLANNED,
  [PHASE_STATUS_IN_PROGRESS]: PHASE_STATUS_IN_PROGRESS,
  [PHASE_STATUS_DELIVERED]: PHASE_STATUS_DELIVERED,
}

class PhaseCard extends React.Component {
  constructor(props) {
    super(props)
    this.toggleCardView = this.toggleCardView.bind(this)
    this.toggleEditView = this.toggleEditView.bind(this)

    this.state = {
      isExpanded: '',
      isEditting: false
    }
  }

  toggleCardView() {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  }

  toggleEditView() {
    this.setState({
      isEditting: !this.state.isEditting
    })
  }

  render() {
    const { attr } = this.props

    const powerRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER]
    const currentUserRoles = attr.currentUserRoles || []
    const isManageUser = currentUserRoles.some((role) => powerRoles.indexOf(role) !== -1)
    const progressInPercent = attr.progressInPercent || 0

    let status = attr && attr.status ? toPhaseCardStatus[attr.status] : PHASE_STATUS_PLANNED
    if (!status) {
      status = PHASE_STATUS_PLANNED
    }
    return (
      <div styleName={'phase-card ' + (this.state.isExpanded ? ' expanded ' : ' ')}>
        <div styleName="static-view">
          <div styleName="col">
            <div styleName="project-details">
              <div styleName="project-ico">
                <ProjectTypeIcon type={attr.icon} />
              </div>
              <div styleName="project-title-container">
                <h4 styleName="project-title">{attr.title}</h4>
                {isManageUser && !this.state.isEditting && !this.state.isExpanded && (<a styleName="edit-btn" onClick={this.toggleEditView} />
                )}
              </div>
              <div styleName="meta-list">
                <span styleName="meta">{attr.duration}</span>
                <span styleName="meta">{attr.startEndDates}</span>
                {attr.posts && <span styleName="meta">{attr.posts}</span>}
              </div>
            </div>
          </div>

          <div styleName="col hide-md">
            <div styleName="price-details">
              <h5>{attr.price}</h5>
              <div styleName="meta-list">{attr.paidStatus}</div>
            </div>
          </div>


          <div styleName="col show-md">
            <div styleName="price-details">
              <h5>{attr.price}</h5>
              <div styleName="meta-list">
                {!progressInPercent && status && status !== 'nostatus' && (<span>{status}</span>)}
                {progressInPercent && (<span>{progressInPercent}% done</span>)}
              </div>
            </div>
          </div>

          <div styleName="col hide-md">
            {status && status !== PHASE_STATUS_IN_PROGRESS &&
              (<div styleName="status-details">
                <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                  {status}
                </div>
              </div>)
            }

            {status && status === PHASE_STATUS_IN_PROGRESS &&
              (<div styleName="status-details">
                <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                  <ProjectProgress
                    title=""
                    viewType={ProjectProgress.ViewTypes.CIRCLE}
                    percent={progressInPercent}
                    thickness={7}
                  >
                    <span className="progress-text">{progressInPercent}% <span className="unit">completed</span></span>
                  </ProjectProgress>

                </div>
              </div>)
            }
          </div>

          {!this.state.isEditting && (<a styleName="toggle-arrow" onClick={this.toggleCardView} />
          )}

          {status && status === PHASE_STATUS_IN_PROGRESS &&
            (
              <div styleName="progressbar"><div styleName="fill" style={{ width: progressInPercent + '%' }} /></div>
            )
          }
        </div>
        {!this.state.isEditting && (<div styleName="expandable-view">
          {this.props.children}
        </div>)}
        {(<div styleName={'sm-separator ' + ((!isManageUser || !this.state.isEditting) ? 'hide ': '')} >
          <EditStageForm phase={attr.phase} phaseIndex={attr.phaseIndex} cancel={this.toggleEditView} update={this.toggleEditView} />
        </div>)}

      </div>
    )
  }
}

PhaseCard.defaultProps = {
  posts: null,
}

PhaseCard.propTypes = {
  attr: PT.shape({
    duration: PT.string.isRequired,
    icon: PT.string.isRequired,
    isExpanded: PT.bool,
    paidStatus: PT.string.isRequired,
    posts: PT.string,
    startEndDates: PT.string.isRequired,
    status: PT.string.isRequired,
    title: PT.string.isRequired,
  })
}

export default PhaseCard
